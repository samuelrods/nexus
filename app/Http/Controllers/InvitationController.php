<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptInvitationRequest;
use App\Http\Requests\StoreInvitationRequest;
use App\Models\OrganizationInvitation;
use App\Models\User;

class InvitationController extends Controller
{
    public function store(StoreInvitationRequest $request, \App\Models\Organization $organization)
    {
        $validated = $request->validated();

        $user = User::where('username', $validated['memberInfo'])
            ->orWhere('email', $validated['memberInfo'])
            ->first();

        // If the user does not exist, return an error.
        if (! $user) {
            return back()->withErrors([
                'memberInfo' => 'The user you are trying to add does not exist.',
            ]);
        }

        $organizationId = $organization->id;

        // If the user is already a member of the organization, return an error.
        if ($user->memberships()->where('organization_id', $organizationId)->exists()) {
            return back()->withErrors([
                'memberInfo' => 'The user you are trying to add is already a member of the organization.',
            ]);
        }

        // Check if the user has an invitation to the organization.
        $invitation = $user->invitations()->where('organization_id', $organizationId)->first();

        // If the user has an invitation, return an error.
        if ($invitation) {
            return back()->withErrors([
                'memberInfo' => 'The user you are trying to add already has an invitation to the organization.',
            ]);
        }

        // Otherwise, create a new invitation.
        $user->invitations()->create([
            'organization_id' => $organizationId,
        ]);

        return back()->with(['message' => 'Invitation sent successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AcceptInvitationRequest $request, OrganizationInvitation $invitation)
    {
        $status = $request->input('status');

        if ($status) {
            $invitation->update(['status' => 'accepted']);

            $invitation->organization->memberships()->create([
                'user_id' => $invitation->user_id,
            ]);

            // Assign default 'member' role
            setPermissionsTeamId($invitation->organization_id);
            $invitation->user->assignRole('member');

            return back()->with(['message' => 'Invitation accepted successfully!', 'type' => 'success']);
        }

        $invitation->update(['status' => 'declined']);

        return back()->with(['message' => 'Invitation declined successfully!', 'type' => 'success']);
    }
}
