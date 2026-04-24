<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SetupOrganization;

class DashboardTest extends TestCase
{
    use RefreshDatabase;
    use SetupOrganization;
    use WithFaker;

    public function test_dashboard_can_be_rendered(): void
    {
        $this->setupOrganization();

        $response = $this->get(route('dashboard', ['organization' => $this->organization->slug]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('dealAreaChartData')
            ->has('dealPieChartData')
            ->has('activityPieChartData')
            ->has('range')
            ->has('teamMemberCount')
            ->has('totalLeads')
            ->has('totalContacts')
            ->has('upcomingActivities')
            ->has('recentLeads')
            ->has('topDeals')
        );
    }

    public function test_dashboard_requires_authentication(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['user_id' => $user->id]);

        $response = $this->get(route('dashboard', ['organization' => $organization->slug]));

        $response->assertRedirect('/login');
    }

    public function test_dashboard_requires_organization_membership(): void
    {
        $this->setupOrganization();
        $otherUser = User::factory()->create();

        $response = $this->actingAs($otherUser)
            ->get(route('dashboard', ['organization' => $this->organization->slug]));

        // Based on CheckOrganizations middleware, it should redirect to organizations.index
        $response->assertRedirect(route('organizations.index'));
    }
}
