<?php

namespace App\Policies;

use App\Enums\RolePermissions;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RolePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(RolePermissions::READ->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->can(RolePermissions::READ->value) && $user->organizations->contains($role->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(RolePermissions::CREATE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        if ($role->name === 'owner') {
            return false;
        }

        return $user->hasRole('owner') || ($user->can(RolePermissions::UPDATE->value) && $user->organizations->contains($role->organization_id));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Role $role): bool
    {
        if ($role->name === 'owner') {
            return false;
        }

        return $user->hasRole('owner') || ($user->can(RolePermissions::DELETE->value) && $user->organizations->contains($role->organization_id));
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Role $role): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        return false;
    }
}
