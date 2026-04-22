<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOrganizations
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If the user is logged in and the organization_id session variable is missing, redirect them to the organizations index.
        if ($request->user() && $request->session()->missing('organization_id')) {
            $memberships = $request->user()->memberships;
            $invitationsCount = $request->user()->invitations()->where('status', 'pending')->count();

            // Automatically select organization if user has only one and no pending invitations
            if ($memberships->count() === 1 && $invitationsCount === 0) {
                $organizationId = $memberships->first()->organization_id;
                session(['organization_id' => $organizationId]);
                setPermissionsTeamId($organizationId);
                return $next($request);
            }

            return redirect()->route('organizations.index');
        }

        // Check if the user is a member of the organization.
        if ($request->session()->has('organization_id') && !$request->user()->organizations->contains($request->session()->get('organization_id'))) {
            session()->forget('organization_id');
            return redirect()->route('organizations.index');
        }

        setPermissionsTeamId(session('organization_id'));

        return $next($request);
    }
}
