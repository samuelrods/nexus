<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\CreatesApplicationData;
use Tests\Traits\SetupOrganization;

class ActivityControllerTest extends TestCase
{
    use CreatesApplicationData;
    use RefreshDatabase;
    use SetupOrganization;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('activities.index', ['organization' => $this->organization->slug]));
    }

    /**
     * Test the index method of ActivityController.
     */
    public function test_activities_can_be_listed()
    {
        $data = $this->createApplicationData($this->organization, $this->user, 3);
        $activities = $data['activities'];

        $response = $this->get(route('activities.index', ['organization' => $this->organization->slug]));

        $response->assertStatus(200);
        $response->assertInertia(
            fn (Assert $page) => $page->component('Activities/Index')
                ->has('pagination.data', $activities->count())
                ->has('filters')
        );
    }

    /**
     * Test the store method of ActivityController.
     */
    public function test_store_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $contact = $data['contacts'][0];
        $lead = $data['leads'][0];

        $requestData = [
            'contact_id' => $contact->id,
            'lead_id' => $lead->id,
            'type' => $this->faker->randomElement(['call', 'email', 'meeting', 'other']),
            'date' => $this->faker->date(),
            'time' => $this->faker->time('H:i:s'),
            'description' => $this->faker->sentence(),
        ];

        $response = $this->post(route('activities.store', ['organization' => $organization->slug]), $requestData);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity created successfully!');

        $this->assertDatabaseHas('activities', $requestData + ['user_id' => $user->id, 'organization_id' => $organization->id]);
    }

    /**
     * Test the update method of ActivityController.
     */
    public function test_update_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $activity = $data['activities'][0];

        $requestData = [
            'type' => $this->faker->randomElement(['call', 'email', 'meeting', 'other']),
            'date' => $this->faker->date(),
            'time' => $this->faker->time('H:i:s'),
            'description' => $this->faker->sentence(),
        ];

        $response = $this->put(route('activities.update', ['organization' => $organization->slug, 'activity' => $activity->id]), $requestData);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity updated successfully!');

        $this->assertDatabaseHas('activities', $requestData + ['id' => $activity->id]);
    }

    /**
     * Test the destroy method of ActivityController.
     */
    public function test_destroy_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $activity = $data['activities'][0];

        $response = $this->delete(route('activities.destroy', ['organization' => $organization->slug, 'activity' => $activity->id]));

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity deleted successfully!');

        $this->assertDatabaseMissing('activities', ['id' => $activity->id]);
    }
}
