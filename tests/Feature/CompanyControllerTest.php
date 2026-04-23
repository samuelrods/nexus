<?php

namespace Tests\Feature\Controllers;

use App\Models\Address;
use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SetupOrganization;

class CompanyControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use SetupOrganization;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('companies.index', ['organization' => $this->organization->slug]));
    }

    public function test_companies_can_be_listed(): void
    {
        $organization = $this->organization;

        $companies = Company::factory(3)->create([
            'organization_id' => $organization->id,
            'address_id' => Address::factory(['organization_id' => $organization->id])
        ]);

        $response = $this->get(route('companies.index', ['organization' => $organization->slug]));

        $response->assertStatus(200);

        $response->assertInertia(
            fn(Assert $page) => $page->component('Companies/Index')
            ->has('pagination.data', 3)
            ->has('stats')
            ->has('filters')
            ->has('industries')
        );
    }

    public function test_company_can_be_created(): void
    {
        $organization = $this->organization;

        $response = $this->post(route('companies.store', ['organization' => $organization->slug]), [
            'name' => $this->faker->company,
            'website' => $this->faker->url,
            'industry' => $this->faker->word,
            'description' => $this->faker->sentence,
            'street_address' => $this->faker->streetAddress,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'zip_code' => $this->faker->postcode,
        ]);

        $response->assertStatus(302);

        $this->assertDatabaseCount('companies', 1);
        $this->assertDatabaseCount('addresses', 1);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Company created successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_company_can_be_updated(): void
    {
        $organization = $this->organization;
        $company = Company::factory()->create(['address_id' => Address::factory(['organization_id' => $organization->id]), 'organization_id' => $organization->id]);

        $data = [
            'name' => 'Updated Company Name',
            'website' => $this->faker->url,
            'industry' => $this->faker->word,
            'description' => $this->faker->sentence,
            'street_address' => $this->faker->streetAddress,
            'city' => $this->faker->city,
            'state' => $this->faker->state,
            'zip_code' => $this->faker->postcode,
        ];

        $response = $this->put(route('companies.update', ['organization' => $organization->slug, 'company' => $company->id]), $data);

        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => $data['name'],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Company updated successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_company_can_be_deleted(): void
    {
        $organization = $this->organization;
        $company = Company::factory()->create(['address_id' => Address::factory(['organization_id' => $organization->id]), 'organization_id' => $organization->id]);

        $response = $this->delete(route('companies.destroy', ['organization' => $organization->slug, 'company' => $company->id]));

        $this->assertDatabaseMissing('companies', ['id' => $company->id]);

        $response->assertRedirect(route('companies.index', ['organization' => $organization->slug]));
        $response->assertSessionHas('message', 'Company deleted successfully!');
        $response->assertSessionHas('type', 'success');
    }
}
