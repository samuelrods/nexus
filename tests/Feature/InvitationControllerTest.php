<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\URL;

class InvitationControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;
    protected $organization;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and organization
        $this->user = User::factory()->create();
        $this->organization = Organization::create(['name' => 'Nexus Org', 'user_id' => $this->user->id, 'created_at' => now()]);
        $this->organization->memberships()->create(['user_id' => $this->user->id]);
        
        $role = Role::create(['name' => 'owner', 'organization_id' => $this->organization->id]);
        
        // seed permissions
        $this->seed(RolesAndPermissionsSeeder::class);

        // Set the user as the logged in user
        $this->actingAs($this->user);
        
        setPermissionsTeamId($this->organization->id);
        $this->user->assignRole($role->name);
        
        URL::defaults(['organization' => $this->organization->slug]);
    }

    public function test_can_invite_user_by_email()
    {
        $invitee = User::factory()->create();

        $response = $this->post(route('invitations.store', ['organization' => $this->organization->slug]), [
            'memberInfo' => $invitee->email
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Invitation sent successfully!');

        $this->assertDatabaseHas('organization_invitations', [
            'user_id' => $invitee->id,
            'organization_id' => $this->organization->id,
            'status' => 'pending'
        ]);
    }

    public function test_cannot_invite_non_existent_user()
    {
        $response = $this->post(route('invitations.store', ['organization' => $this->organization->slug]), [
            'memberInfo' => 'nonexistent@example.com'
        ]);

        $response->assertSessionHasErrors('memberInfo');
        $this->assertDatabaseCount('organization_invitations', 0);
    }

    public function test_cannot_invite_existing_member()
    {
        $existingMember = User::factory()->create();
        $this->organization->memberships()->create(['user_id' => $existingMember->id]);

        $response = $this->post(route('invitations.store', ['organization' => $this->organization->slug]), [
            'memberInfo' => $existingMember->email
        ]);

        $response->assertSessionHasErrors('memberInfo');
    }

    public function test_cannot_invite_user_twice()
    {
        $invitee = User::factory()->create();
        OrganizationInvitation::create([
            'user_id' => $invitee->id,
            'organization_id' => $this->organization->id,
            'status' => 'pending'
        ]);

        $response = $this->post(route('invitations.store', ['organization' => $this->organization->slug]), [
            'memberInfo' => $invitee->email
        ]);

        $response->assertSessionHasErrors('memberInfo');
    }

    public function test_invitation_can_be_accepted()
    {
        $invitee = User::factory()->create();
        $invitation = OrganizationInvitation::create([
            'user_id' => $invitee->id,
            'organization_id' => $this->organization->id,
            'status' => 'pending'
        ]);

        // Create 'member' role for the organization
        Role::create(['name' => 'member', 'organization_id' => $this->organization->id]);

        $response = $this->actingAs($invitee)->put(route('invitations.update', $invitation), [
            'status' => true
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Invitation accepted successfully!');

        $this->assertEquals('accepted', $invitation->fresh()->status);
        $this->assertTrue($this->organization->members()->where('user_id', $invitee->id)->exists());
        
        setPermissionsTeamId($this->organization->id);
        $this->assertTrue($invitee->hasRole('member'));
    }

    public function test_invitation_can_be_declined()
    {
        $invitee = User::factory()->create();
        $invitation = OrganizationInvitation::create([
            'user_id' => $invitee->id,
            'organization_id' => $this->organization->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($invitee)->put(route('invitations.update', $invitation), [
            'status' => false
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Invitation declined successfully!');

        $this->assertEquals('declined', $invitation->fresh()->status);
        $this->assertFalse($this->organization->members()->where('user_id', $invitee->id)->exists());
    }
}
