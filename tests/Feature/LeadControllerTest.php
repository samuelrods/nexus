<?php

namespace Tests\Feature;

use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SetupOrganization;

class LeadControllerTest extends TestCase
{
    use RefreshDatabase;
    use SetupOrganization;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->setupOrganization();
        $this->from(route('leads.index', ['organization' => $this->organization->slug]));
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
            'company_id' => $company->id,
        ]);

        $response = $this->get(route('leads.index', ['organization' => $organization->slug]));

        $response->assertStatus(200)
            ->assertInertia(
                fn (Assert $page) => $page
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
            'company_id' => $company->id,
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
            'company_id' => $company->id,
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
            'contact_id' => $otherContact->id,
        ]);

        $response = $this->get(route('leads.show', ['organization' => $this->organization->slug, 'lead' => $otherLead->id]));

        $response->assertStatus(403);
    }
}
