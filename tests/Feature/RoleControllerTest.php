<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SetupOrganization;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use SetupOrganization;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('roles.index', ['organization' => $this->organization->slug]));
    }

    public function test_roles_can_be_listed(): void
    {
        $organization = $this->organization;

        // Create roles
        Role::factory()->count(3)->create(['organization_id' => $organization->id]);

        // Make the index request
        $response = $this->get(route('roles.index', ['organization' => $organization->slug]));

        // Assert the response status is 200 (OK)
        $response->assertStatus(200);

        // Assert the fetched roles match the created roles (3 created + 1 owner)
        $response->assertInertia(fn(Assert $page) => $page->component('Roles/Index')
            ->has('pagination.data', 4)
            ->has('permissions')
        );
    }

    public function test_role_can_be_created_with_valid_data(): void
    {
        // Get some existing permissions
        $permissions = Permission::limit(3)->get();

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
            'organization_id' => $this->organization->id,
        ]);

        // Assert the role has the correct permissions
        $role = Role::where('name', $data['name'])->where('organization_id', $this->organization->id)->first();
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
        // Get some existing permissions
        $permissions = Permission::limit(3)->get();

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
            'id' => $role->id,
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
