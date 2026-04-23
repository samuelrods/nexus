<?php

namespace Tests\Feature\Controllers;

use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SetupOrganization;

class MemberControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use SetupOrganization;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('members.index', ['organization' => $this->organization->slug]));
    }

    public function test_members_can_be_listed(): void
    {
        $organization = $this->organization;

        $members = User::factory()->count(3)->create();
        $members->each(fn($member) => $organization->members()->attach($member->id));

        $response = $this->get(route('members.index'));

        $response->assertStatus(200);

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
        $organization = $this->organization;

        $member = User::factory()->create();
        $organization->members()->attach($member);
        $membership = $organization->memberships()->where('user_id', $member->id)->first();

        $response = $this->delete(route('members.destroy', ['organization' => $organization->slug, 'member' => $membership]));

        $this->assertDatabaseMissing(OrganizationMember::class, ['id' => $membership->id]);

        $response->assertRedirect(route('members.index', ['organization' => $organization->slug]));
        $response->assertSessionHas('message', 'Member deleted successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_member_cannot_be_deleted_if_owner(): void
    {
        $organization = $this->organization;

        $ownerMembership = $organization->memberships()->where('user_id', $this->user->id)->first();

        $response = $this->delete(route('members.destroy', ['organization' => $organization->slug, 'member' => $ownerMembership]));

        $this->assertDatabaseHas(OrganizationMember::class, ['id' => $ownerMembership->id]);

        $response->assertSessionHas('message', 'You cannot remove the owner of the organization.');
        $response->assertSessionHas('type', 'failure');
    }

    public function test_cannot_access_member_of_another_organization(): void
    {
        $otherOrg = Organization::create(['name' => 'Other Org', 'user_id' => User::factory()->create()->id]);
        $otherMember = User::factory()->create();
        $otherOrg->members()->attach($otherMember);
        $otherMembership = $otherOrg->memberships()->where('user_id', $otherMember->id)->first();

        $response = $this->get(route('members.show', ['organization' => $this->organization->slug, 'member' => $otherMembership]));

        $response->assertStatus(403);
    }
}
