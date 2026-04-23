<?php

namespace App\Policies;

use App\Enums\AddressPermissionsEnum;
use App\Models\Address;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AddressPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(AddressPermissionsEnum::READ_ADDRESSES);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Address $address): bool
    {
        return $user->can(AddressPermissionsEnum::READ_ADDRESSES);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
        return $user->can(AddressPermissionsEnum::CREATE_ADDRESSES);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Address $address): bool
    {
        //
        return $user->can(AddressPermissionsEnum::UPDATE_ADDRESSES);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Address $address): bool
    {
        //
        return $user->can(AddressPermissionsEnum::DELETE_ADDRESSES);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Address $address): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Address $address): bool
    {
        return false;
    }
}
