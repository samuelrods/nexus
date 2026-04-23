<?php

namespace Tests\Feature;

use App\Http\Controllers\ActivityController;
use App\Models\Activity;
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
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Illuminate\Support\Facades\URL;

trait CreatesActivityTestData
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

        $activities = collect();

        $leads->each(function (Lead $lead, $index) use ($organization, $contacts, $companies, $activities, $user) {
            $activity = Activity::factory()->create([
                'user_id' => $user->id,
                'contact_id' => $contacts[$index]->id,
                'lead_id' => $lead->id,
                'organization_id' => $organization->id,
            ]);

            $activities->push($activity);
        });

        return compact('companies', 'contacts', 'leads', 'activities');
    }
}

class ActivityControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;
    use CreatesActivityTestData;

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
        $this->from(route('activities.index', ['organization' => $organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Create user and organization properties
        $this->user = $user;
        $this->organization = $organization;
    }

    /**
     * Test the index method of ActivityController.
     */
    public function test_activities_can_be_listed()
    {
        // Create a user and organization
        $user = $this->user;
        $organization = $this->organization;
        $data = $this->createApplicationData($organization, $user, 3);
        $activities = $data['activities'];

        // Make a GET request to the index method
        $response = $this->get(route('activities.index', ['organization' => $organization->slug]));

        // Assert that the response has a successful status code
        $response->assertStatus(200);

        // Assert that the response has the expected data
        $response->assertInertia(
            fn(Assert $page) => $page->component('Activities/Index')
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
        $company = Company::factory()->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);
        $lead = Lead::factory()->create([
            'company_id' => $company->id,
            'contact_id' => $contact->id,
            'organization_id' => $organization->id,
        ]);

        // Generate valid data for the request
        $data = [
            'contact_id' => $contact->id,
            'lead_id' => $lead->id,
            'type' => $this->faker->randomElement(['call', 'email', 'meeting', 'other']),
            'date' => $this->faker->date(),
            'time' => $this->faker->time('H:i:s'),
            'description' => $this->faker->sentence(),
        ];

        // Make a POST request to the store method
        $response = $this->post(route('activities.store', ['organization' => $organization->slug]), $data);

        // Assert that the response has a successful status code
        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity created successfully!');

        // Assert that the activity was created in the database
        $this->assertDatabaseHas('activities', $data + ['user_id' => $user->id, 'organization_id' => $organization->id]);
    }

    /**
     * Test the update method of ActivityController.
     */
    public function test_update_method()
    {
        // Create a user and organization
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $activity = $data['activities'][0];

        // Generate valid data for the request
        $data = [
            'type' => $this->faker->randomElement(['call', 'email', 'meeting', 'other']),
            'date' => $this->faker->date(),
            'time' => $this->faker->time('H:i:s'),
            'description' => $this->faker->sentence(),
        ];

        // Make a PUT request to the update method
        $response = $this->put(route('activities.update', ['organization' => $organization->slug, 'activity' => $activity->id]), $data);

        // Assert that the response has a successful status code
        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity updated successfully!');

        // Assert that the activity was updated in the database
        $this->assertDatabaseHas('activities', $data + ['id' => $activity->id]);
    }

    /**
     * Test the destroy method of ActivityController.
     */
    public function test_destroy_method()
    {
        // Create a user and organization
        $organization = $this->organization;
        $user = $this->user;
        $data = $this->createApplicationData($organization, $user);
        $activity = $data['activities'][0];

        // Make a DELETE request to the destroy method
        $response = $this->delete(route('activities.destroy', ['organization' => $organization->slug, 'activity' => $activity->id]));

        // Assert that the response has a successful status code
        $response->assertRedirect();
        $response->assertSessionHas('message', 'Activity deleted successfully!');

        // Assert that the activity was deleted from the database
        $this->assertDatabaseMissing('activities', ['id' => $activity->id]);
    }
}
