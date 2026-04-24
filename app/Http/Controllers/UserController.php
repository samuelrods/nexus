<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Set the organization for the user.
     */
    public function setOrganization(Request $request): RedirectResponse
    {
        $request->validate([
            'organization_id' => ['required', 'exists:organizations,id'],
        ]);

        $organizationId = $request->input('organization_id');

        $organization = auth()->user()->organizations()->find($organizationId);
        if ($organization) {
            session(['organization_id' => $organizationId]);
            setPermissionsTeamId($organizationId);

            return redirect()->route('dashboard', ['organization' => $organization->slug]);
        }

        return abort(403, 'You are not authorized to access this organization.');
    }
}
