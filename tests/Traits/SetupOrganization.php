<?php

namespace Tests\Traits;

use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\URL;

trait SetupOrganization
{
    protected $user;
    protected $organization;
    protected $ownerRole;

    protected function setupOrganization()
    {
        // Create a user and organization
        $user = User::factory()->create();
        $organization = Organization::create([
            'name' => $this->faker->unique()->company,
            'user_id' => $user->id,
            'created_at' => now()
        ]);

        $organization->memberships()->create(['user_id' => $user->id]);
        
        $role = Role::create([
            'name' => 'owner',
            'organization_id' => $organization->id,
            'guard_name' => 'web'
        ]);

        // seed permissions
        $this->seed(RolesAndPermissionsSeeder::class);
        $role->syncPermissions(Permission::all());

        // Set the user as the logged in user
        $this->actingAs($user);

        // Set the organization as the current organization
        $this->session(['organization_id' => $organization->id]);

        // Set the organization as the current team
        setPermissionsTeamId($organization->id);

        $user->assignRole($role->name);

        // Set the organization as a default for URL generation
        URL::defaults(['organization' => $organization->slug]);

        // Clear the cached permissions
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Assign properties
        $this->user = $user;
        $this->organization = $organization;
        $this->ownerRole = $role;

        return [$user, $organization];
    }
}
