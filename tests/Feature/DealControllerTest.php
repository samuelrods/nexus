<?php

namespace Tests\Feature;

use App\Http\Controllers\DealController;
use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Request;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Illuminate\Support\Facades\URL;

trait CreatesApplicationData
{
    protected function createApplicationData($organization, $user, $num = 1)
    {
        $companies = Company::factory($num)->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contacts = Contact::factory($num)->create(['organization_id' => $organization->id, 'user_id' => $user->id]);
        $leads = collect();

        $companies->each(function (Company $company, $index) use ($organization, $contacts, $leads) {
            $lead = Lead::factory()->create([
                'company_id' => $company->id,
                'contact_id' => $contacts[$index]->id,
                'organization_id' => $organization->id,
            ]);

            $leads->push($lead);
        });

        $deals = collect();

        $leads->each(function (Lead $lead, $index) use ($organization, $contacts, $companies, $deals, $user) {
            $deal = Deal::factory()->create([
                'lead_id' => $lead->id,
                'contact_id' => $contacts[$index]->id,
                'company_id' => $companies[$index]->id,
                'user_id' => $user->id,
                'organization_id' => $organization->id,
            ]);

            $deals->push($deal);
        });

        return compact('companies', 'contacts', 'leads', 'deals');
    }
}

class DealControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use CreatesApplicationData;

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

        // Set the previous URL
        $this->from(route('deals.index', ['organization' => $organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Create user and organization properties
        $this->user = $user;
        $this->organization = $organization;
    }

    /**
     * Test the index method of DealController.
     */
    public function test_index_method()
    {
        // arrange
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user, 3);

        // act
        $response = $this->get(route('deals.index', ['organization' => $organization->slug]));

        // assert
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

        $data = [
            'lead_id' => $lead->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id,
            'name' => 'Test Deal',
            'value' => 100,
            'close_date' => now()->format('Y-m-d'),
            'status' => 'won',
            'description' => 'Test description',
        ];

        $response = $this->post(route('deals.store', ['organization' => $organization->slug]), $data);

        $response->assertRedirect()
            ->assertSessionHas('message', 'Deal created successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('deals', $data + ['organization_id' => $organization->id]);
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
