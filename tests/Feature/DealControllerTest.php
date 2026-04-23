<?php

namespace Tests\Feature;

use App\Models\Deal;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\CreatesApplicationData;
use Tests\Traits\SetupOrganization;

class DealControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use SetupOrganization;
    use CreatesApplicationData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('deals.index', ['organization' => $this->organization->slug]));
    }

    /**
     * Test the index method of DealController.
     */
    public function test_index_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user, 3);

        $response = $this->get(route('deals.index', ['organization' => $organization->slug]));

        $response->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                ->component('Deals/Index')
                ->has('pagination.data', $data['deals']->count())
                ->has('stats')
                ->has('filters')
            );
    }

    /**
     * Test the store method of DealController.
     */
    public function test_store_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $contact = $data['contacts'][0];
        $company = $data['companies'][0];
        $lead = $data['leads'][0];

        $requestData = [
            'lead_id' => $lead->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id,
            'name' => 'Test Deal',
            'value' => 100,
            'close_date' => now()->format('Y-m-d'),
            'status' => 'won',
            'description' => 'Test description',
        ];

        $response = $this->post(route('deals.store', ['organization' => $organization->slug]), $requestData);

        $response->assertRedirect()
            ->assertSessionHas('message', 'Deal created successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('deals', $requestData + ['organization_id' => $organization->id]);
    }

    /**
     * Test the update method of DealController.
     */
    public function test_update_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $deal = $data['deals'][0];

        $newData = [
            'name' => 'Updated Deal',
            'value' => 200,
        ];

        $response = $this->put(route('deals.update', ['organization' => $organization->slug, 'deal' => $deal]), $newData);

        $response->assertRedirect()
            ->assertSessionHas('message', 'Deal updated successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('deals', $newData + ['id' => $deal->id]);
    }

    /**
     * Test the destroy method of DealController.
     */
    public function test_destroy_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $deal = $data['deals'][0];

        $response = $this->delete(route('deals.destroy', ['organization' => $organization->slug, 'deal' => $deal]));

        $response->assertRedirect()
            ->assertSessionHas('message', 'Deal deleted successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseMissing(Deal::class, ['id' => $deal->id]);
    }
}
