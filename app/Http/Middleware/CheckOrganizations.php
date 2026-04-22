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
        // If the route has an organization parameter, prioritize it
        $slug = $request->route('organization');
        $organization = null;

        if ($slug instanceof \App\Models\Organization) {
            // Verify the user actually belongs to this organization
            if ($request->user()->organizations->contains($slug->id)) {
                $organization = $slug;
            } else {
                return redirect()->route('organizations.index')->with(['message' => 'You do not have access to this organization.', 'type' => 'error']);
            }
        } elseif (is_string($slug)) {
            $organization = $request->user()->organizations()->where('slug', $slug)->first();
        }

        // If no organization found from route, fallback to session
        if (!$organization) {
            $organizationId = session('organization_id');
            $organization = $organizationId ? $request->user()->organizations()->find($organizationId) : null;
        }

        // If still no organization, handle selection/auto-selection
        if (!$organization) {
            $memberships = $request->user()->memberships;
            $invitationsCount = $request->user()->invitations()->where('status', 'pending')->count();

            if ($memberships->count() === 1 && $invitationsCount === 0) {
                $organization = $memberships->first()->organization;
                session(['organization_id' => $organization->id]);
                setPermissionsTeamId($organization->id);
                
                return redirect()->route($request->route()->getName() ?: 'dashboard', ['organization' => $organization->slug]);
            }

            return redirect()->route('organizations.index');
        }

        // Sync session and permissions
        if (session('organization_id') !== $organization->id) {
            session(['organization_id' => $organization->id]);
        }
        
        setPermissionsTeamId($organization->id);
        
        // Set global default for the 'organization' route parameter
        \Illuminate\Support\Facades\URL::defaults(['organization' => $organization->slug]);

        return $next($request);
    }
}
