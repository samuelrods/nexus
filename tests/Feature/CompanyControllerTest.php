<?php

namespace Tests\Feature\Controllers;

use App\Models\Address;
use App\Models\Company;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompanyControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    protected $user;
    protected $organization;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user and organization
        $user = User::factory()->create();
        $organization = Organization::create(['name' => $this->faker->unique()->company, 'user_id' => $user->id, 'created_at' => now()]);
        $organization->memberships()->create(['user_id' => $user->id]);
        $role = Role::create(['name' => 'owner', 'organization_id' => $organization->id]);

        // seed permissions
        $this->seed(RolesAndPermissionsSeeder::class);

        // Set the user as the logged in user
        $this->actingAs($user);

        // Set the organization as the current organization
        $this->session(['organization_id' => $organization->id]);

        // Set the organization as the current team
        setPermissionsTeamId($organization->id);

        $user->assignRole($role->name);

        // Set the organization as a default for URL generation
        URL::defaults(['organization' => $organization->slug]);

        $this->from(route('companies.index', ['organization' => $organization->slug]));

        // Create user and organization properties
        $this->user = $user;
        $this->organization = $organization;
    }

    public function test_companies_can_be_listed(): void
    {
        // Create organization companies
        $organization = $this->organization;

        $companies = Company::factory(3)->create([
            'organization_id' => $organization->id,
            'address_id' => Address::factory(['organization_id' => $organization->id])
        ]);

        // Make the index request
        $response = $this->get(route('companies.index', ['organization' => $organization->slug]));

        // Assert the response status is 200 (OK)
        $response->assertStatus(200);

        // Assert the fetched companies match the created companies
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

        // Make the store request
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

        // Assert the company was created
        $this->assertDatabaseCount('companies', 1);
        $this->assertDatabaseCount('addresses', 1);

        // Assert the response was a redirect
        $response->assertRedirect();

        // Assert the session has the success message
        $response->assertSessionHas('message', 'Company created successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_company_can_be_updated(): void
    {
        // Create organization and company
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

        // Make the update request
        $response = $this->put(route('companies.update', ['organization' => $organization->slug, 'company' => $company->id]), $data);

        // Assert the company was updated
        $this->assertDatabaseHas('companies', [
            'id' => $company->id,
            'name' => $data['name'],
        ]);

        // Assert the response was a redirect
        $response->assertRedirect();

        // Assert the session has the success message
        $response->assertSessionHas('message', 'Company updated successfully!');
        $response->assertSessionHas('type', 'success');
    }

    public function test_company_can_be_deleted(): void
    {
        // Create organization and company
        $organization = $this->organization;
        $company = Company::factory()->create(['address_id' => Address::factory(['organization_id' => $organization->id]), 'organization_id' => $organization->id]);

        // Make the delete request
        $response = $this->delete(route('companies.destroy', ['organization' => $organization->slug, 'company' => $company->id]));

        // Assert the company was deleted
        $this->assertDatabaseMissing('companies', ['id' => $company->id]);

        // Assert the response was a redirect back to index
        $response->assertRedirect(route('companies.index', ['organization' => $organization->slug]));

        // Assert the session has the success message
        $response->assertSessionHas('message', 'Company deleted successfully!');
        $response->assertSessionHas('type', 'success');
    }
}
