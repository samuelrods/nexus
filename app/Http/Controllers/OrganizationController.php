<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\OrganizationMember;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $memberships = auth()->user()->memberships()
            ->with(['organization' => function($query) {
                $query->withCount(['members', 'deals'])->with('user');
            }])
            ->get();
            
        $invitations = auth()->user()->invitations()
            ->where('status', 'pending')
            ->with(['organization' => function($query) {
                $query->withCount(['members', 'deals'])->with('user');
            }])
            ->get();

        return Inertia::render('Organizations', [
            'memberships' => $memberships,
            'invitations' => $invitations
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $organization = Organization::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
            'created_at' => now(),
        ]);

        $organization->memberships()->save(OrganizationMember::make([
            'user_id' => auth()->id(),
        ]));

        // create default roles
        $this->createDefaultRoles($organization);

        setPermissionsTeamId($organization->id);

        // assign the owner role to the owner
        $organization->user->assignRole('owner');

        session(['organization_id' => $organization->id]);
        setPermissionsTeamId($organization->id);

        return to_route('dashboard', ['organization' => $organization->slug])->with(['message' => 'Organization created successfully!', 'type' => 'success']);
    }

    /**
     * Create default roles for a new organization.
     */
    private function createDefaultRoles(Organization $organization)
    {
        $allPermissions = Permission::all();

        // 1. Owner - Full Access
        $owner = Role::create([
            'name' => 'owner',
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);
        $owner->syncPermissions($allPermissions);

        // 2. Administrator - Full Access
        $admin = Role::create([
            'name' => 'administrator',
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);
        $admin->syncPermissions($allPermissions);

        // 3. Manager - Most Access, no Role Management
        $manager = Role::create([
            'name' => 'manager',
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);
        $manager->syncPermissions($allPermissions->filter(function($p) {
            return !str_contains($p->name, 'roles');
        }));

        // 4. Member - Basic Access
        $member = Role::create([
            'name' => 'member',
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);
        $member->syncPermissions($allPermissions->filter(function($p) {
            return str_starts_with($p->name, 'read-') || 
                   str_starts_with($p->name, 'create-') ||
                   (str_starts_with($p->name, 'update-') && !str_contains($p->name, 'members') && !str_contains($p->name, 'roles'));
        }));
    }

    /**
     * Display organization settings.
     */
    public function settings(Organization $organization)
    {
        $organization->loadCount(['members', 'deals']);

        return Inertia::render('Organizations/Settings', [
            'organization' => $organization
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization)
    {
        $this->authorize('update', $organization);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'currency' => ['required', 'string', 'size:3'],
        ]);

        $organization->update($request->only('name', 'currency'));

        return back()->with(['message' => 'Settings updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization)
    {
        $this->authorize('delete', $organization);

        $organization->roles->each(function ($role) {
            $role->delete();
        });
        $organization->delete();
        session()->forget('organization_id');

        return to_route('organizations.index')->with(['message' => 'Organization deleted successfully!', 'type' => 'success']);
    }
}
