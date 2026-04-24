<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        return view('users.index', [
            'items' => User::search($request->input('query') ?? '')->paginate(10),
            'resourceName' => 'users',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('users.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ])->assignRole($validated['role']);

        return redirect('/users')->with(['message' => 'User created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

        return view('users.show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return view('users.edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validated();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        if (isset($validated['role'])) {
            $user->syncRoles($validated['role']);
        }

        return redirect('/users')->with(['message' => 'User updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        // Check for constraints before deleting the user
        if ($user->projects()->exists()) {
            return redirect('/users')->with(['message' => 'Unable to delete the user as there are associated projects.', 'type' => 'failure']);
        }

        $user->delete();

        return redirect('/users')->with(['message' => 'User deleted successfully!', 'type' => 'success']);
    }

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
