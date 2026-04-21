<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $numOfMembers = env('NUM_OF_MEMBERS', 5);
        $numOfRecByMember = env('NUM_OF_REC_BY_MEMBER', 5);

        $adminName = env('ADMIN_NAME', 'Admin');
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');

        $owner = User::factory()->create([
            'name' => $adminName,
            'email' => $adminEmail,
            'password' => bcrypt($adminPassword),
        ]);
        $organization = Organization::factory()->create(['user_id' => $owner->id]);
        $organization->memberships()->create(['user_id' => $owner->id]);
        $members = User::factory($numOfMembers)->create();

        // create owner role
        Role::create(['name' => 'owner', 'organization_id' => $organization->id]);

        setPermissionsTeamId($organization->id);

        // assign owner role to owner
        $owner->assignRole('owner');

        // Create the organization members
        $organization->memberships()->createMany(
            $members->map(fn(User $user) => ['user_id' => $user->id])->toArray()
        );

        // Create the contacts for each member
        $contacts = $members->flatmap(function (user $user) use ($organization, $numOfRecByMember) {
            return Contact::factory($numOfRecByMember)->create([
                'user_id' => $user->id,
                'organization_id' => $organization->id,
            ]);
        });

        // Create the compannies of the organization
        $companies = $organization->companies()->createMany(
            Company::factory($numOfMembers * $numOfRecByMember)->make(['address_id' => Address::factory(['organization_id' => $organization->id])])->toArray()
        );

        // Create the leads of the organization
        $leads = collect();

        $companies->each(function (Company $company, $index) use ($organization, $contacts, $leads) {
            $lead = Lead::factory()->create([
                'company_id' => $company->id,
                'contact_id' => $contacts[$index]->id,
                'organization_id' => $organization->id,
            ]);

            $leads->push($lead);
        });

        // Create the deals of the organization
        $members->each(function (User $user, $index) use ($leads, $contacts, $companies, $organization, $numOfRecByMember) {
            for ($i = 0; $i < $numOfRecByMember; $i++) {
                Deal::factory()->create([
                    'lead_id' => $leads[$index * $numOfRecByMember + $i]->id,
                    'contact_id' => $contacts[$index * $numOfRecByMember + $i]->id,
                    'company_id' => $companies[$index * $numOfRecByMember+ $i]->id,
                    'user_id' => $user->id,
                    'organization_id' => $organization->id,
                ]);
            }
        });

        // Create the activities of the organization
        $members->each(function (User $user, $index) use ($leads, $contacts, $organization, $numOfRecByMember) {
            for ($i = 0; $i < $numOfRecByMember; $i++) {
                Activity::factory()->create([
                    'user_id' => $user->id,
                    'contact_id' => $contacts[$index * $numOfRecByMember + $i]->id,
                    'lead_id' => $leads[$index * $numOfRecByMember + $i]->id,
                    'organization_id' => $organization->id,
                ]);
            }
        });
    }
}
