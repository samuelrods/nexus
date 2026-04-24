<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvitationRequest;
use App\Http\Requests\UpdateMemberRequest;
use App\Http\Resources\MemberResource;
use App\Http\Resources\MemberRolesResource;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\OrganizationMember;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Organization $organization)
    {
        $this->authorize('viewAny', OrganizationMember::class);

        $organizationId = $organization->id;

        $roles = Role::where('organization_id', $organizationId)
            ->orderBy('name')
            ->select(['id', 'name'])
            ->get();

        $sortBy = $request->input('sort_by', 'first_name');
        $sortDir = $request->input('sort_dir', 'asc');

        $query = $organization->members();

        if ($request->filled('query')) {
            $searchTerm = '%'.$request->input('query').'%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'like', $searchTerm)
                    ->orWhere('last_name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm);
            });
        }

        $membersPagination = $query->orderBy($sortBy, $sortDir)
            ->paginate(10)->withQueryString();

        return Inertia::render('Members/Index', [
            'pagination' => MemberResource::collection($membersPagination),
            'rolesData' => MemberRolesResource::collection($roles),
            'filters' => $request->only(['query', 'sort_by', 'sort_dir']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $this->authorize('create', OrganizationMember::class);

        return Inertia::render('Members/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvitationRequest $request, Organization $organization)
    {
        $this->authorize('create', OrganizationMember::class);

        // This logic is mostly in InvitationController@store, but we can call it here or redirect.
        // For consistency with other resources, we'll keep the invitation logic.
        return app(InvitationController::class)->store($request, $organization);
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, OrganizationMember $member)
    {
        $this->authorize('view', $member);

        return Inertia::render('Members/Show', [
            'member' => new MemberResource($member),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, OrganizationMember $member)
    {
        $this->authorize('update', $member);

        $organizationId = $organization->id;
        $roles = Role::where('organization_id', $organizationId)
            ->orderBy('name')
            ->get();

        return Inertia::render('Members/Edit', [
            'member' => new MemberResource($member),
            'roles' => MemberRolesResource::collection($roles),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberRequest $request, Organization $organization, OrganizationMember $member)
    {
        $this->authorize('update', $member);

        $member->update($request->validated());

        $role = Role::find($request->input('role_id'));

        $member->user->syncRoles($role->name);

        return back()->with(['message' => 'Member updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, OrganizationMember $member)
    {
        $this->authorize('delete', $member);

        // If the user is the owner of the organization, return an error.
        if ($member->organization->user_id === $member->user_id) {
            return back()->with(['message' => 'You cannot remove the owner of the organization.', 'type' => 'failure']);
        }

        // Get the invitation for the member.
        OrganizationInvitation::where('user_id', $member->user_id)
            ->where('organization_id', $member->organization_id)
            ->delete();

        $member->delete();

        // If the member is the current user, forget the organization_id session variable.
        if ($member->user_id === auth()->id()) {
            session()->forget('organization_id');
        }

        return back()->with(['message' => 'Member deleted successfully!', 'type' => 'success']);
    }
}
