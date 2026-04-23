<?php
namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_can_be_rendered(): void
    {
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['user_id' => $user->id]);
        $organization->members()->attach($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard', ['organization' => $organization->slug]));

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
        $owner = User::factory()->create();
        $user = User::factory()->create();
        $organization = Organization::factory()->create(['user_id' => $owner->id]); // User is not a member

        $response = $this->actingAs($user)
            ->get(route('dashboard', ['organization' => $organization->slug]));

        // Based on CheckOrganizations middleware, it should redirect to organizations.index
        $response->assertRedirect(route('organizations.index'));
    }
}
