<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Activity;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Policies\ActivityPolicy;
use App\Policies\CompanyPolicy;
use App\Policies\ContactPolicy;
use App\Policies\DealPolicy;
use App\Policies\LeadPolicy;
use App\Policies\OrganizationMemberPolicy;
use App\Policies\OrganizationPolicy;
use App\Policies\RolePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Organization::class => OrganizationPolicy::class,
        OrganizationMember::class => OrganizationMemberPolicy::class,
        Role::class => RolePolicy::class,
        Contact::class => ContactPolicy::class,
        Company::class => CompanyPolicy::class,
        Lead::class => LeadPolicy::class,
        Deal::class => DealPolicy::class,
        Activity::class => ActivityPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
    }
}
