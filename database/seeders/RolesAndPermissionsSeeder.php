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
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        foreach (RolePermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (MemberPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (ContactPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (CompanyPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (LeadPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (DealPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (ActivityPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }

        foreach (OrganizationPermissions::toArray() as $permission) {
            app(Permission::class)->findOrCreate($permission, 'web');
        }
    }
}
