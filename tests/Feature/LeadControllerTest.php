<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
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

class LeadControllerTest extends TestCase
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
        $role->syncPermissions(\App\Models\Permission::all());

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
        $this->from(route('leads.index', ['organization' => $organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Create user and organization properties
        $this->user = $user;
        $this->organization = $organization;
    }

    public function test_index_method()
    {
        $organization = $this->organization;
        $user = $this->user;

        $company = Company::factory()->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);
        $leads = Lead::factory(3)->create([
            'organization_id' => $organization->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id
        ]);

        $response = $this->get(route('leads.index', ['organization' => $organization->slug]));

        $response->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                ->component('Leads/Index')
                ->has('pagination.data', 3)
                ->has('filters')
            );
    }

    public function test_store_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $company = Company::factory()->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        $data = [
            'company_id' => $company->id,
            'contact_id' => $contact->id,
            'status' => 'open',
            'source' => 'website',
            'description' => 'Test Lead Description',
        ];

        $response = $this->post(route('leads.store', ['organization' => $organization->slug]), $data);

        $response->assertRedirect()
            ->assertSessionHas('message', 'Lead created successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('leads', $data + ['organization_id' => $organization->id]);
    }

    public function test_update_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $company = Company::factory()->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);
        $lead = Lead::factory()->create([
            'organization_id' => $organization->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id
        ]);

        $newData = [
            'description' => 'Updated Description',
            'status' => 'closed',
        ];

        $response = $this->put(route('leads.update', ['organization' => $organization->slug, 'lead' => $lead->id]), $newData);

        $response->assertRedirect()
            ->assertSessionHas('message', 'Lead updated successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('leads', $newData + ['id' => $lead->id]);
    }

    public function test_destroy_method()
    {
        $organization = $this->organization;
        $user = $this->user;
        $company = Company::factory()->create(['organization_id' => $organization->id, 'address_id' => Address::factory(['organization_id' => $organization->id])]);
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);
        $lead = Lead::factory()->create([
            'organization_id' => $organization->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id
        ]);

        $response = $this->delete(route('leads.destroy', ['organization' => $organization->slug, 'lead' => $lead->id]));

        $response->assertRedirect()
            ->assertSessionHas('message', 'Lead deleted successfully!')
            ->assertSessionHas('type', 'success');

        $this->assertDatabaseMissing('leads', ['id' => $lead->id]);
    }

    public function test_store_validation()
    {
        $response = $this->post(route('leads.store', ['organization' => $this->organization->slug]), []);

        $response->assertSessionHasErrors(['company_id', 'contact_id', 'status', 'source']);
    }

    public function test_cannot_access_lead_of_another_organization()
    {
        $otherOrg = Organization::create(['name' => 'Other Org', 'user_id' => User::factory()->create()->id]);
        $otherCompany = Company::factory()->create(['organization_id' => $otherOrg->id, 'address_id' => Address::factory(['organization_id' => $otherOrg->id])]);
        $otherContact = Contact::factory()->create(['organization_id' => $otherOrg->id, 'user_id' => $otherOrg->user_id]);
        $otherLead = Lead::factory()->create([
            'organization_id' => $otherOrg->id,
            'company_id' => $otherCompany->id,
            'contact_id' => $otherContact->id
        ]);

        $response = $this->get(route('leads.show', ['organization' => $this->organization->slug, 'lead' => $otherLead->id]));

        $response->assertStatus(403);
    }
}
