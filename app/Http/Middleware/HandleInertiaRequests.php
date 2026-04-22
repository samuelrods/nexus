<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'flash' => [
                'alert' => ['message' => $request->session()->get('message'), 'type' => $request->session()->get('type')],
            ],
            'auth' => [
                'user' => function () use ($request) {
                    if (!$user = $request->user()) {
                        return null;
                    }
                    
                    return [
                        'id' => $user->id,
                        'username' => $user->username,
                        'full_name' => $user->full_name,
                        'email' => $user->email,
                        'memberships' => $user->memberships()->with('organization')->get(),
                        'permissions' => $user->getAllPermissions()->pluck('name'),
                        'roles' => $user->getRoleNames(),
                    ];
                },
                'organization' => fn () => session('organization_id') 
                    ? Organization::find(session('organization_id')) 
                    : null,
            ],
        ]);
    }
}
