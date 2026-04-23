<?php

namespace Tests\Feature\Controllers;

use App\Http\Resources\MemberResource;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();

        // seed permissions
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);

        // Create a user and organization
        $user = User::factory()->create();
        $organization = Organization::create(['name' => $this->faker->unique()->company, 'user_id' => $user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $user->id]);
        $role = Role::create(['name' => 'owner', 'organization_id' => $organization->id]);
        
        // sync permissions
        $role->syncPermissions(\App\Models\Permission::all());

        // Set the user as the logged in user
        $this->actingAs($user);

        // Set the organization as the current organization
        $this->session(['organization_id' => $organization->id]);

        // Set the organization as the current team
        setPermissionsTeamId($organization->id);

        $user->assignRole($role->name);

        // Set the organization as a default for URL generation
        URL::defaults(['organization' => $organization->slug]);

        $this->from(route('members.index', ['organization' => $organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function test_members_can_be_listed(): void
    {
        // Create organization members
        $members = User::factory()->count(3)->create();
        $organization = Organization::find(session('organization_id'));

        $members->each(fn($member) => $organization->members()->attach($member->id));

        // dd($organization->members->count());

        // Make the index request
        $response = $this->get(route('members.index'));

        // Assert the response status is 200 (OK)
        $response->assertStatus(200);

        // dd($response->getOriginalContent());

        // Assert the fetched members match the created members
        $response->assertInertia(
            fn(Assert $page) => $page->component('Members/Index')
            ->has(
                'pagination.data',
                4 // 3 members + 1 owner
            )
            ->has('rolesData')
            ->has('filters')
        );
    }

    public function test_member_can_be_deleted(): void
    {
        // Create organization member
        $member = User::factory()->create();
        $organization = Organization::find(session('organization_id'));
        $organization->members()->attach($member);
        $membership = $organization->memberships()->where('user_id', $member->id)->first();

        // Make the delete request
        $response = $this->delete(route('members.destroy', ['organization' => $organization->slug, 'member' => $membership]));

        // Assert the member was deleted
        $this->assertDatabaseMissing(OrganizationMember::class, ['id' => $membership->id]);

        // Assert the response was a redirect back
        $response->assertRedirect(route('members.index', ['organization' => $organization->slug]));

        // Assert the session has the success message
        $response->assertSessionHas('message', 'Member deleted successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_member_cannot_be_deleted_if_owner(): void
    {
        // Create organization owner
        $owner = User::factory()->create();
        $organization = Organization::find(session('organization_id'));
        $organization->update(['user_id' => $owner->id]);
        $organization->members()->attach($owner);
        $membership = $organization->memberships()->where('user_id', $owner->id)->first();

        // Make the delete request
        $response = $this->delete(route('members.destroy', ['organization' => $organization->slug, 'member' => $membership]));

        // Assert the member was not deleted
        $this->assertDatabaseHas(OrganizationMember::class, ['id' => $membership->id]);

        // Assert the response has the failure message
        $response->assertSessionHas('message', 'You cannot remove the owner of the organization.');
        $response->assertSessionHas('type', 'failure');
    }

    public function test_cannot_access_member_of_another_organization(): void
    {
        $otherOrg = Organization::create(['name' => 'Other Org', 'user_id' => User::factory()->create()->id]);
        $otherMember = User::factory()->create();
        $otherOrg->members()->attach($otherMember);
        $otherMembership = $otherOrg->memberships()->where('user_id', $otherMember->id)->first();

        $organization = Organization::find(session('organization_id'));

        $response = $this->get(route('members.show', ['organization' => $organization->slug, 'member' => $otherMembership]));

        $response->assertStatus(403);
    }
}
