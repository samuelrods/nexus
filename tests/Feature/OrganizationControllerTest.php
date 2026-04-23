<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Illuminate\Support\Facades\URL;

class OrganizationControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // seed permissions
        $this->seed(RolesAndPermissionsSeeder::class);

        // Create a user
        $this->user = User::factory()->create();

        // Set the user as the logged in user
        $this->actingAs($this->user);
    }

    public function test_organizations_can_be_listed()
    {
        $organization = Organization::create(['name' => 'Org 1', 'user_id' => $this->user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $this->user->id]);

        $response = $this->get(route('organizations.index'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
            ->component('Organizations')
            ->has('memberships', 1)
            ->has('invitations')
        );
    }

    public function test_organization_can_be_created()
    {
        $data = ['name' => 'New Organization'];

        $response = $this->post(route('organizations.store'), $data);

        $organization = Organization::where('name', 'New Organization')->first();

        $response->assertRedirect(route('dashboard', ['organization' => $organization->slug]));
        $response->assertSessionHas('message', 'Organization created successfully!');

        $this->assertDatabaseHas('organizations', ['name' => 'New Organization', 'user_id' => $this->user->id]);
        
        // Check if default roles were created
        $this->assertEquals(4, Role::where('organization_id', $organization->id)->count());
        $this->assertTrue($this->user->hasRole('owner'));
    }

    public function test_organization_name_is_required()
    {
        $response = $this->post(route('organizations.store'), ['name' => '']);

        $response->assertSessionHasErrors('name');
    }

    public function test_organization_settings_can_be_viewed()
    {
        $organization = Organization::create(['name' => 'Org 1', 'user_id' => $this->user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $this->user->id]);
        
        URL::defaults(['organization' => $organization->slug]);

        $response = $this->get(route('organizations.settings', ['organization' => $organization->slug]));

        $response->assertStatus(200);
        $response->assertInertia(
            fn(Assert $page) => $page
            ->component('Organizations/Settings')
            ->has('organization')
        );
    }

    public function test_organization_can_be_updated()
    {
        $organization = Organization::create(['name' => 'Org 1', 'user_id' => $this->user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $this->user->id]);
        
        $role = Role::create(['name' => 'owner', 'organization_id' => $organization->id]);
        $role->syncPermissions(\App\Models\Permission::all());
        setPermissionsTeamId($organization->id);
        $this->user->assignRole($role->name);
        \Illuminate\Support\Facades\URL::defaults(['organization' => $organization->slug]);

        $data = ['name' => 'Updated Name', 'currency' => 'EUR'];

        $response = $this->put(route('organizations.update', ['organization' => $organization->slug]), $data);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Settings updated successfully!');

        $this->assertDatabaseHas('organizations', ['id' => $organization->id, 'name' => 'Updated Name', 'currency' => 'EUR']);
    }

    public function test_organization_update_requires_authorization()
    {
        $otherUser = User::factory()->create();
        $organization = Organization::create(['name' => 'Org 1', 'user_id' => $otherUser->id, 'created_at' => now()]);
        
        $response = $this->put(route('organizations.update', ['organization' => $organization->slug]), [
            'name' => 'Hack Attempt',
            'currency' => 'USD'
        ]);

        $response->assertStatus(403);
    }

    public function test_organization_can_be_deleted()
    {
        $organization = Organization::create(['name' => 'To Delete', 'user_id' => $this->user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $this->user->id]);
        
        $role = Role::create(['name' => 'owner', 'organization_id' => $organization->id]);
        $role->syncPermissions(\App\Models\Permission::all());
        setPermissionsTeamId($organization->id);
        $this->user->assignRole($role->name);

        $response = $this->delete(route('organizations.destroy', ['organization' => $organization->slug]));

        $response->assertRedirect(route('organizations.index'));
        $response->assertSessionHas('message', 'Organization deleted successfully!');

        $this->assertDatabaseMissing('organizations', ['id' => $organization->id]);
        $this->assertDatabaseMissing('roles', ['organization_id' => $organization->id]);
    }
}
