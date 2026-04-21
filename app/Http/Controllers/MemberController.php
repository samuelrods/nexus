<?php

namespace App\Http\Controllers;

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
    public function index(Request $request)
    {
        $this->authorize('viewAny', OrganizationMember::class);

        $organizationId = session('organization_id');
        $organization = Organization::find($organizationId);

        $roles = Role::where('organization_id', $organizationId)
            ->orderBy('name')
            ->select(['id', 'name'])
            ->get();

        if ($request->filled('query')) {
            $searchResults = User::search($request->input('query'))
                ->whereIn('id', $organization->members()->pluck('users.id')->toArray())
                ->paginate(10);

            return Inertia::render('Members', [
                'pagination' => MemberResource::collection($searchResults),
                'rolesData' => MemberRolesResource::collection($roles),
            ]);
        }

        $membersPagination = $organization->members()
            ->orderBy('first_name')
            ->orderBy('users.id')
            ->paginate(10);

        return Inertia::render('Members', [
            'pagination' => MemberResource::collection($membersPagination),
            'rolesData' => MemberRolesResource::collection($roles),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMemberRequest $request, OrganizationMember $member)
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
    public function destroy(OrganizationMember $member)
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
