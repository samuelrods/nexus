<?php

namespace App\Http\Controllers;

use App\Enums\ActivityPermissions;
use App\Enums\CompanyPermissions;
use App\Enums\ContactPermissions;
use App\Enums\DealPermissions;
use App\Enums\LeadPermissions;
use App\Enums\MemberPermissions;
use App\Enums\OrganizationPermissions;
use App\Enums\RolePermissions;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Organization $organization)
    {
        $this->authorize('viewAny', Role::class);

        $organizationId = $organization->id;

        $permissions = $this->getPermissions();

        if ($request->filled('query')) {
            $searchResults = Role::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Roles/Index', [
                'pagination' => RoleResource::collection($searchResults),
                'permissions' => $permissions,
            ]);
        }

        $rolesPagination = Role::where('organization_id', $organizationId)
            ->with(['permissions'])
            ->withCount('users')
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Roles/Index', [
            'pagination' => RoleResource::collection($rolesPagination),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $this->authorize('create', Role::class);

        return Inertia::render('Roles/Create', [
            'permissions' => $this->getPermissions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request, Organization $organization)
    {
        $this->authorize('create', Role::class);

        $validated = $request->validated();

        $role = Role::create([
            'name' => ucfirst($validated['name']),
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);

        $role->syncPermissions(Permission::whereIn('id', $validated['permissions'])->get());

        return redirect()->route('roles.show', $role->id)->with(['message' => 'Role created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Role $role)
    {
        $this->authorize('view', $role);

        return Inertia::render('Roles/Show', [
            'role' => new RoleResource($role->load(['permissions', 'users'])->loadCount('users')),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Role $role)
    {
        $this->authorize('update', $role);

        return Inertia::render('Roles/Edit', [
            'role' => new RoleResource($role->load('permissions')),
            'permissions' => $this->getPermissions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Organization $organization, Role $role)
    {
        $this->authorize('update', $role);

        if ($role->name === 'owner') {
            return back()->with(['message' => 'The owner role cannot be modified.', 'type' => 'failure']);
        }

        $validated = $request->validated();

        if (isset($validated['name'])) {
            $role->update([
                'name' => ucfirst($validated['name']),
            ]);
        }

        $role->syncPermissions(Permission::whereIn('id', $validated['permissions'])->get());

        return redirect()->route('roles.show', $role->id)->with(['message' => 'Role updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Role $role)
    {
        $this->authorize('delete', $role);

        if ($role->name === 'owner') {
            return back()->with(['message' => 'The owner role cannot be deleted.', 'type' => 'failure']);
        }

        $role->delete();

        return redirect()->route('roles.index')->with(['message' => 'Role deleted successfully!', 'type' => 'success']);
    }

    private function getPermissions()
    {
        $permissionTypes = [
            'roles' => RolePermissions::class,
            'members' => MemberPermissions::class,
            'contacts' => ContactPermissions::class,
            'companies' => CompanyPermissions::class,
            'leads' => LeadPermissions::class,
            'deals' => DealPermissions::class,
            'activities' => ActivityPermissions::class,
            'organizations' => OrganizationPermissions::class,
        ];

        $allPermissions = Permission::all();

        $permissions = [];

        foreach ($permissionTypes as $type => $class) {
            // Filter the permissions in memory
            $permissions[$type] = $allPermissions->whereIn('name', $class::toArray())->values()->map(function ($permission) use ($class) {
                return [
                    'value' => $permission->id,
                    'label' => $class::from($permission->name)->label(),
                ];
            });
        }

        return $permissions;
    }
}
