<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\OrganizationMember;
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

        // create a role for the owner
        Role::create([
            'name' => 'owner',
            'guard_name' => 'web',
            'organization_id' => $organization->id,
        ]);

        setPermissionsTeamId($organization->id);

        // assign the owner role to the owner
        $organization->user->syncRoles([$organization->roles->first()->name]);
        // $member->user->syncRoles($role->name);


        return to_route('organizations.index')->with(['message' => 'Organization created successfully!', 'type' => 'success']);
    }

    /**
     * Display organization settings.
     */
    public function settings()
    {
        $organization = Organization::withCount(['members', 'deals'])->findOrFail(session('organization_id'));

        return Inertia::render('Organizations/Settings', [
            'organization' => $organization
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization)
    {
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
        $organization->roles->each(function ($role) {
            $role->delete();
        });
        $organization->delete();
        session()->forget('organization_id');
    }
}
