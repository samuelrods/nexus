<?php

namespace Tests\Feature;

use App\Enums\ContactPermissions;
use App\Http\Resources\ContactResource;
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

class ContactControllerTest extends TestCase
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

        // Set the previous URL
        $this->from(route('contacts.index', ['organization' => $organization->slug]));

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Create user and organization properties
        $this->user = $user;
        $this->organization = $organization;
    }

    public function test_owner_can_see_contacts(): void
    {
        $user = $this->user;
        $organization = $this->organization;

        $contacts = Contact::factory()->count(15)->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        $response = $this->get(route('contacts.index', ['organization' => $organization->slug]));

        $response->assertStatus(200);

        // assert the fetched contacts match the created contacts
        $response->assertInertia(fn(Assert $page) => $page->component('Contacts/Index')
            ->has('pagination.data', 10)
            ->has('stats')
            ->has('filters')
        );
    }

    public function test_member_can_see_contacts_with_permissions(): void
    {
        $owner = $this->user;
        $organization = $this->organization;

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $role = Role::create(['name' => 'test', 'organization_id' => $organization->id, 'guard_name' => 'web']);
        $role->givePermissionTo(ContactPermissions::READ->value);
        $member->assignRole($role->name);

        $contacts = Contact::factory()->count(15)->create(['organization_id' => $organization->id, 'user_id' => $member->id]);

        $response = $this->actingAs($member)->get(route('contacts.index', ['organization' => $organization->slug]));

        $response->assertStatus(200);

        // assert the fetched contacts match the created contacts
        $response->assertInertia(fn(Assert $page) => $page->component('Contacts/Index')
            ->has('pagination.data', 10)
            ->has('stats')
            ->has('filters')
        );
    }

    public function test_member_cannot_see_contacts_without_permission(): void
    {
        $owner = $this->user;
        $organization = $this->organization;

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $response = $this->actingAs($member)->get(route('contacts.index', ['organization' => $organization->slug]));

        $response->assertStatus(403);
    }

    /**
     * Test storing a newly created resource in storage.
    */
    public function test_contact_can_be_created_with_valid_data_by_owner(): void
    {
        $user = $this->user;
        $organization = $this->organization;

        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone_number' => '1234567890',
            'organization_name' => 'Example Organization',
            'job_title' => 'Developer',
            'description' => 'Lorem ipsum dolor sit amet.',
        ];

        $response = $this->post(route('contacts.store', ['organization' => $organization->slug]), $data);

        $response->assertStatus(302);
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact created successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('contacts', [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'organization_id' => $organization->id,
            'user_id' => $user->id,
        ]);

        $this->assertCount(1, Contact::all());
    }

    public function test_contact_cannot_be_created_with_invalid_data_by_owner(): void
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => '',
            'phone_number' => '1234567890',
            'organization_name' => 'Example Organization',
            'job_title' => 'Developer',
            'description' => 'Lorem ipsum dolor sit amet.',
        ];

        $response = $this->post(route('contacts.store', ['organization' => $this->organization->slug]), $data);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_can_be_created_with_valid_data_by_member_with_permission(): void
    {
        $owner = $this->user;
        $organization = $this->organization;

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $role = Role::create(['name' => 'test', 'organization_id' => $organization->id, 'guard_name' => 'web']);
        $role->givePermissionTo(ContactPermissions::CREATE->value);
        $member->assignRole($role->name);

        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'example@example.com',
            'phone_number' => '1234567890',
            'organization_name' => 'Example Organization',
            'job_title' => 'Developer',
            'description' => 'Lorem ipsum dolor sit amet.',
        ];

        $this->actingAs($member);

        $response = $this->post(route('contacts.store', ['organization' => $organization->slug]), $data);

        $response->assertStatus(302);
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact created successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('contacts', [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'phone_number' => $data['phone_number'],
            'organization_id' => $organization->id,
            'user_id' => $member->id,
        ]);

        $this->assertCount(1, Contact::all());
    }

    public function test_contact_can_be_updated_with_valid_data_by_owner(): void
    {
        // arrange
        $user = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        $data = [
            'first_name' => $this->faker()->firstName(),
            'last_name' => $this->faker()->lastName(),
            'description' => 'New description',
        ];

        // act
        $response = $this->put(route('contacts.update', ['organization' => $organization->slug, 'contact' => $contact->id]), $data);

        // assert
        $response->assertStatus(302);
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact updated successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'description' => $data['description'],
        ]);
    }

    public function test_contact_cannot_be_updated_with_invalid_data_by_owner(): void
    {
        // arrange
        $user = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        $data = [
            'email' => 'not a email',
        ];

        // act
        $response = $this->put(route('contacts.update', ['organization' => $organization->slug, 'contact' => $contact->id]), $data);

        // assert
        $response->assertSessionHasErrors(['email']);

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'email' => $contact->email,
        ]);
    }

    public function test_contact_can_be_updated_with_permission_by_member(): void
    {
        /**
         * ARRANGE
         */
        $owner = $this->user;
        $organization = $this->organization;

        // create contact
        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $owner->id]);

        // create member
        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        // create role with permission
        $role = Role::create(['name' => 'test', 'organization_id' => $organization->id, 'guard_name' => 'web']);
        $role->givePermissionTo(ContactPermissions::UPDATE->value);

        // assign role to member
        $member->assignRole($role->name);

        // create data to update contact
        $data = [
            'first_name' => $this->faker()->firstName(),
            'last_name' => $this->faker()->lastName(),
            'description' => 'New description',
        ];

        // login as member
        $this->actingAs($member);

        /**
         * ACT
         */
        $response = $this->put(route('contacts.update', ['organization' => $organization->slug, 'contact' => $contact->id]), $data);

        /**
         * ASSERT
         */
        $response->assertStatus(302);
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact updated successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'description' => $data['description'],
        ]);
    }

    public function test_contact_cannot_be_updated_without_permission_by_member(): void
    {
        // arrange
        $owner = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $owner->id]);

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $data = [
            'first_name' => $this->faker()->firstName(),
            'last_name' => $this->faker()->lastName(),
            'description' => 'New description',
        ];

        $this->actingAs($member);

        // act
        $response = $this->put(route('contacts.update', ['organization' => $organization->slug, 'contact' => $contact->id]), $data);

        // assert
        $response->assertStatus(403);
    }

    public function test_contact_can_be_deleted_by_owner(): void
    {
        // arrange
        $user = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        // act
        $response = $this->delete(route('contacts.destroy', ['organization' => $organization->slug, 'contact' => $contact->id]));

        // assert
        $response->assertStatus(302);
        $response->assertRedirect(route('contacts.index', ['organization' => $organization->slug]));
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact deleted successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseMissing('contacts', [
            'id' => $contact->id,
        ]);
    }

    public function test_contact_can_be_deleted_by_member(): void
    {
        // arrange
        $owner = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $owner->id]);

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $role = Role::create(['name' => 'test', 'organization_id' => $organization->id, 'guard_name' => 'web']);
        $role->givePermissionTo(ContactPermissions::DELETE->value);
        $member->assignRole($role->name);

        $this->actingAs($member);

        // act
        $response = $this->delete(route('contacts.destroy', ['organization' => $organization->slug, 'contact' => $contact->id]));

        // assert
        $response->assertStatus(302);
        $response->assertRedirect(route('contacts.index', ['organization' => $organization->slug]));
        $response->assertSessionHasNoErrors();
        $response->assertSessionHas('message', 'Contact deleted successfully!');
        $response->assertSessionHas('type', 'success');

        $this->assertDatabaseMissing('contacts', [
            'id' => $contact->id,
        ]);
    }

    public function test_contact_cannot_be_deleted_without_permission_by_member(): void
    {
        // arrange
        $owner = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $owner->id]);

        $member = User::factory()->create();
        $organization->memberships()->create(['user_id' => $member->id]);

        $this->actingAs($member);

        // act
        $response = $this->delete(route('contacts.destroy', ['organization' => $organization->slug, 'contact' => $contact->id]));

        // assert
        $response->assertStatus(403);
    }

    public function test_contact_cannot_be_deleted_if_has_leads(): void
    {
        // arrange
        $user = $this->user;
        $organization = $this->organization;

        $contact = Contact::factory()->create(['organization_id' => $organization->id, 'user_id' => $user->id]);

        $company = Company::factory()->create([
            'address_id' => Address::factory(['organization_id' => $organization->id]),
            'organization_id' => $organization->id
        ]);

        $lead = Lead::factory()->create([
            'organization_id' => $organization->id,
            'contact_id' => $contact->id,
            'company_id' => $company->id
        ]);

        // act
        $response = $this->delete(route('contacts.destroy', ['organization' => $organization->slug, 'contact' => $contact->id]));

        // assert
        $response->assertStatus(302);
        $response->assertRedirect(route('contacts.index', ['organization' => $organization->slug]));
        $response->assertSessionHas('message', 'Contact has leads and cannot be deleted.');
        $response->assertSessionHas('type', 'failure');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
        ]);
    }
}
