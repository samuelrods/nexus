<?php

namespace Tests\Feature\Controllers;

use App\Http\Resources\RoleResource;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;
    protected $organization;

    protected function setUp(): void
    {
        parent::setUp();

        // seed permissions
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

        // Create a user and organization
        $this->user = User::factory()->create();
        $this->organization = Organization::create(['name' => $this->faker->unique()->company, 'user_id' => $this->user->id, 'created_at' => now()]);
        $this->organization->memberships()->create(['user_id' => $this->user->id]);
        $role = Role::create(['name' => 'owner', 'organization_id' => $this->organization->id]);
        $role->syncPermissions(Permission::all());

        // Set the user as the logged in user
        $this->actingAs($this->user);

        // Set the organization as the current organization
        $this->session(['organization_id' => $this->organization->id]);

        // Set the organization as the current team
        setPermissionsTeamId($this->organization->id);

        $this->user->assignRole($role->name);

        // Set the organization as a default for URL generation
        URL::defaults(['organization' => $this->organization->slug]);

        // Set the previous URL
        $this->from(route('roles.index', ['organization' => $this->organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_roles_can_be_listed(): void
    {
        // Create roles
        $roles = Role::factory()->count(3)->create();

        // Make the index request
        $response = $this->get(route('roles.index', ['organization' => $this->organization->slug]));

        // Assert the response status is 200 (OK)
        $response->assertStatus(200);

        // Assert the fetched roles match the created roles
        $response->assertInertia(fn(Assert $page) => $page->component('Roles/Index')
            ->has('pagination.data', 4)
            ->has('permissions')
        );
    }

    public function test_role_can_be_created_with_valid_data(): void
    {
        // Create permissions
        $permissions = Permission::factory()->count(3)->create();

        // Make the create request
        $data = [
            'name' => $this->faker->unique()->word,
            'permissions' => $permissions->pluck('id')->toArray(),
        ];

        // Assert the role was created
        $response = $this->post(route('roles.store', ['organization' => $this->organization->slug]), $data);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Role created successfully!');
        $response->assertSessionHas('type', 'success');

        // Assert the role has the correct name
        $this->assertDatabaseHas('roles', [
            'name' => $data['name'],
        ]);

        // Assert the role has the correct permissions
        $role = Role::where('name', $data['name'])->first();
        $this->assertCount(count($data['permissions']), $role->permissions);
        $this->assertTrue($role->permissions->pluck('id')->contains($permissions->first()->id));
    }

    public function test_role_cannot_be_created_with_invalid_data(): void
    {
        // Make the create request
        $response = $this->post(route('roles.store', ['organization' => $this->organization->slug]), []);

        // Assert the role was not created
        $response->assertSessionHasErrors(['name', 'permissions']);
    }

    public function test_role_can_be_updated_with_valid_data(): void
    {
        // Create permissions
        $permissions = Permission::factory()->count(3)->create();

        // Create a role
        $role = Role::factory()->create(['organization_id' => $this->organization->id]);

        // Assign the first permission to the role
        $role->syncPermissions([$permissions[0]]);

        // Make the update request
        $data = [
            'name' => $this->faker->unique()->word,
            'permissions' => $permissions->pluck('id')->toArray(),
        ];

        $response = $this->put(route('roles.update', ['organization' => $this->organization->slug, 'role' => $role]), $data);

        // Assert the role was updated
        $response->assertRedirect();
        $response->assertSessionHas('message', 'Role updated successfully!');
        $response->assertSessionHas('type', 'success');

        // Assert the role has the new name
        $this->assertDatabaseHas('roles', [
            'name' => $data['name'],
        ]);

        // Assert the role has the new permissions
        $role = $role->fresh();

        $this->assertCount(count($data['permissions']), $role->permissions);
        $this->assertTrue($role->permissions->pluck('id')->contains($permissions->first()->id));
    }

    public function test_role_cannot_be_updated_with_invalid_data(): void
    {
        // Create a role
        $role = Role::factory()->create(['organization_id' => $this->organization->id]);

        // Make the update request
        $response = $this->put(route('roles.update', ['organization' => $this->organization->slug, 'role' => $role]), []);

        // Assert the role was not updated
        $response->assertSessionHasErrors(['name', 'permissions']);
    }

    public function test_role_can_be_deleted(): void
    {
        // Create a role
        $role = Role::factory()->create(['organization_id' => $this->organization->id]);

        // Make the delete request
        $response = $this->delete(route('roles.destroy', ['organization' => $this->organization->slug, 'role' => $role]));

        // Assert the role was deleted
        $this->assertDatabaseMissing('roles', [
            'id' => $role->id,
        ]);

        // Assert the response was a redirect back
        $response->assertRedirect();

        // Assert the session has the success message
        $response->assertSessionHas('message', 'Role deleted successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_cannot_delete_owner_role(): void
    {
        $role = Role::where('name', 'owner')->where('organization_id', $this->organization->id)->first();

        $response = $this->delete(route('roles.destroy', ['organization' => $this->organization->slug, 'role' => $role]));

        $response->assertStatus(403);
        // Policy returns false for owner, so 403 is expected.
        // The controller's nice message is unreachable if the policy blocks it.

        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }

    public function test_cannot_update_owner_role(): void
    {
        $role = Role::where('name', 'owner')->where('organization_id', $this->organization->id)->first();

        $response = $this->put(route('roles.update', ['organization' => $this->organization->slug, 'role' => $role]), [
            'name' => 'Hacker Role',
            'permissions' => [Permission::first()->id]
        ]);

        $response->assertStatus(403);
        // Policy returns false for owner

        $this->assertEquals('owner', $role->fresh()->name);
    }

    public function test_cannot_access_role_of_another_organization(): void
    {
        $otherOrg = Organization::create(['name' => 'Other Org', 'user_id' => User::factory()->create()->id]);
        $otherRole = Role::create(['name' => 'Secret Role', 'organization_id' => $otherOrg->id, 'guard_name' => 'web']);

        $response = $this->get(route('roles.show', ['organization' => $this->organization->slug, 'role' => $otherRole]));

        $response->assertStatus(403);
    }
}
