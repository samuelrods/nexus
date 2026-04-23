<?php

namespace App\Policies;

use App\Enums\DealPermissions;
use App\Models\Deal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DealPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(DealPermissions::READ->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Deal $deal): bool
    {
        return $user->can(DealPermissions::READ->value) && $user->organizations->contains($deal->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(DealPermissions::CREATE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Deal $deal): bool
    {
        return $user->can(DealPermissions::UPDATE->value) && $user->organizations->contains($deal->organization_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Deal $deal): bool
    {
        return $user->can(DealPermissions::DELETE->value) && $user->organizations->contains($deal->organization_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Deal $deal): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Deal $deal): bool
    {
        return false;
    }
}
