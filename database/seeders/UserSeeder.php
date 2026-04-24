<?php

namespace Database\Seeders;

use App\Enums\ActivityPermissions;
use App\Enums\CompanyPermissions;
use App\Enums\ContactPermissions;
use App\Enums\DealPermissions;
use App\Enums\LeadPermissions;
use App\Enums\MemberPermissions;
use App\Enums\OrganizationPermissions;
use App\Enums\RolePermissions;
use App\Enums\RolesEnum;
use App\Models\Activity;
use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Main Admin User
        $admin = User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // 2. Create Organizations
        $nexus = Organization::factory()->create([
            'name' => 'Nexus Corp',
            'user_id' => $admin->id,
        ]);

        $acmeOwner = User::factory()->create(['first_name' => 'John', 'last_name' => 'Doe']);
        $acme = Organization::factory()->create([
            'name' => 'Acme Inc',
            'user_id' => $acmeOwner->id,
        ]);

        $globexOwner = User::factory()->create(['first_name' => 'Hank', 'last_name' => 'Scorpio']);
        $globex = Organization::factory()->create([
            'name' => 'Globex Corporation',
            'user_id' => $globexOwner->id,
        ]);

        // 3. Set up Memberships & Invitations for Admin
        $nexus->memberships()->create(['user_id' => $admin->id]);
        $acme->memberships()->create(['user_id' => $admin->id]);
        $acme->memberships()->create(['user_id' => $acmeOwner->id]);
        $globex->memberships()->create(['user_id' => $globexOwner->id]);

        OrganizationInvitation::create([
            'user_id' => $admin->id,
            'organization_id' => $globex->id,
            'status' => 'pending',
        ]);

        // 4. Set up Nexus Corp (Primary Testing Org)
        $this->seedOrganization($nexus, $admin);

        // 5. Set up Acme Inc (Secondary Org)
        $this->seedOrganization($acme, $acmeOwner);
    }

    private function seedOrganization(Organization $org, User $owner)
    {
        setPermissionsTeamId($org->id);

        // Create Roles
        $ownerRole = Role::create(['name' => 'owner', 'organization_id' => $org->id]);
        $adminRole = Role::create(['name' => RolesEnum::ADMINISTRATOR->value, 'organization_id' => $org->id]);
        $salesRole = Role::create(['name' => RolesEnum::SALES->value, 'organization_id' => $org->id]);

        // Assign all permissions to owner and admin roles
        $allPermissions = array_merge(
            ActivityPermissions::toArray(),
            CompanyPermissions::toArray(),
            ContactPermissions::toArray(),
            DealPermissions::toArray(),
            LeadPermissions::toArray(),
            MemberPermissions::toArray(),
            OrganizationPermissions::toArray(),
            RolePermissions::toArray()
        );
        $ownerRole->syncPermissions($allPermissions);
        $adminRole->syncPermissions($allPermissions);

        // Sales only gets some
        $salesRole->syncPermissions(array_merge(
            [ActivityPermissions::READ->value, ActivityPermissions::CREATE->value, ActivityPermissions::UPDATE->value],
            [CompanyPermissions::READ->value, CompanyPermissions::CREATE->value, CompanyPermissions::UPDATE->value],
            [ContactPermissions::READ->value, ContactPermissions::CREATE->value, ContactPermissions::UPDATE->value],
            [DealPermissions::READ->value, DealPermissions::CREATE->value, DealPermissions::UPDATE->value],
            [LeadPermissions::READ->value, LeadPermissions::CREATE->value, LeadPermissions::UPDATE->value]
        ));

        // Assign owner role to owner
        $owner->assignRole($ownerRole);

        // Create members
        $members = User::factory(fake()->numberBetween(5, 10))->create();
        foreach ($members as $member) {
            $org->memberships()->create(['user_id' => $member->id]);
            $role = fake()->randomElement([$adminRole, $salesRole]);
            $member->assignRole($role);
        }

        $allMembers = $members->concat([$owner]);

        // Create Companies
        $companies = Company::factory(fake()->numberBetween(15, 20))->create([
            'organization_id' => $org->id,
            'address_id' => Address::factory(['organization_id' => $org->id]),
        ]);

        foreach ($companies as $company) {
            // Create 1-3 contacts per company
            $contacts = Contact::factory(fake()->numberBetween(1, 3))->create([
                'organization_id' => $org->id,
                'user_id' => $allMembers->random()->id,
            ]);

            foreach ($contacts as $contact) {
                // Not every contact becomes a lead
                if (fake()->boolean(70)) {
                    $lead = Lead::factory()->create([
                        'organization_id' => $org->id,
                        'company_id' => $company->id,
                        'contact_id' => $contact->id,
                    ]);

                    // Some leads have deals
                    if (fake()->boolean(60)) {
                        Deal::factory(fake()->numberBetween(1, 2))->create([
                            'organization_id' => $org->id,
                            'lead_id' => $lead->id,
                            'company_id' => $company->id,
                            'contact_id' => $contact->id,
                            'user_id' => $allMembers->random()->id,
                        ]);
                    }

                    // Activities for the lead/contact
                    Activity::factory(fake()->numberBetween(1, 5))->create([
                        'organization_id' => $org->id,
                        'lead_id' => $lead->id,
                        'contact_id' => $contact->id,
                        'user_id' => $allMembers->random()->id,
                    ]);
                }
            }
        }
    }
}
