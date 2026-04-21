<?php

namespace App\Http\Controllers;

use App\Enums\ActivityPermissions;
use App\Enums\CompanyPermissions;
use App\Enums\ContactPermissions;
use App\Enums\DealPermissions;
use App\Enums\LeadPermissions;
use App\Enums\MemberPermissions;
use App\Enums\RolePermissions;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);

        $organizationId = session('organization_id');

        // Cache the permissions for 24 hours
        $permissions = Cache::remember('permissions', 60 * 60 * 24, function () {
            $permissionTypes = [
                'roles' => RolePermissions::class,
                'members' => MemberPermissions::class,
                'contacts' => ContactPermissions::class,
                'companies' => CompanyPermissions::class,
                'leads' => LeadPermissions::class,
                'deals' => DealPermissions::class,
                'activities' => ActivityPermissions::class,
            ];

            $allPermissions = Permission::all();

            $permissions = [];

            foreach ($permissionTypes as $type => $class) {
                // Filter the permissions in memory
                $permissions[$type] = $allPermissions->whereIn('name', $class::toArray())->map(function ($permission) use ($class) {
                    return [
                        'value' => $permission->id,
                        'label' => $class::from($permission->name)->label(),
                    ];
                });
            }

            return $permissions;
        });

        if ($request->filled('query')) {
            $searchResults = Role::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Roles', [
                'pagination' => RoleResource::collection($searchResults),
                'permissions' => $permissions,
            ]);
        }

        $rolesPagination = Role::where('organization_id', $organizationId)
            ->with('permissions')
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Roles', [
            'pagination' => RoleResource::collection($rolesPagination),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->authorize('create', Role::class);

        $validated = $request->validated();

        $role = Role::create([
            'name' => ucfirst($validated['name']),
            'guard_name' => 'web',
            'organization_id' => session('organization_id'),
        ]);

        $role->syncPermissions(Permission::whereIn('id', $validated['permissions'])->get());

        return back()->with(['message' => 'Role created successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $role->update([
                'name' => ucfirst($validated['name']),
            ]);
        }

        $role->syncPermissions(Permission::whereIn('id', $validated['permissions'])->get());

        return back()->with(['message' => 'Role updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $this->authorize('delete', $role);

        $role->delete();

        return back()->with(['message' => 'Role deleted successfully!', 'type' => 'success']);
    }
}
