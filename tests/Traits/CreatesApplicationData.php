<?php

namespace Tests\Traits;

use App\Models\Activity;
use App\Models\Address;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;

trait CreatesApplicationData
{
    protected function createApplicationData($organization, $user, $num = 1)
    {
        $companies = Company::factory($num)->create([
            'organization_id' => $organization->id,
            'address_id' => Address::factory(['organization_id' => $organization->id]),
        ]);

        $contacts = Contact::factory($num)->create([
            'organization_id' => $organization->id,
            'user_id' => $user->id,
        ]);

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
        $activities = collect();

        $leads->each(function (Lead $lead, $index) use ($organization, $contacts, $companies, $deals, $activities, $user) {
            $deal = Deal::factory()->create([
                'lead_id' => $lead->id,
                'contact_id' => $contacts[$index]->id,
                'company_id' => $companies[$index]->id,
                'user_id' => $user->id,
                'organization_id' => $organization->id,
            ]);
            $deals->push($deal);

            $activity = Activity::factory()->create([
                'user_id' => $user->id,
                'contact_id' => $contacts[$index]->id,
                'lead_id' => $lead->id,
                'organization_id' => $organization->id,
            ]);
            $activities->push($activity);
        });

        return compact('companies', 'contacts', 'leads', 'deals', 'activities');
    }
}
