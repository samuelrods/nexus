<?php

namespace App\Policies;

use App\Enums\OrganizationMemberPermissions;
use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrganizationMemberPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(OrganizationMemberPermissions::READ->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OrganizationMember $organizationMember): bool
    {
        return $user->can(OrganizationMemberPermissions::READ->value) && $user->organizations->contains($organizationMember->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(OrganizationMemberPermissions::CREATE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OrganizationMember $organizationMember): bool
    {
        return $user->can(OrganizationMemberPermissions::UPDATE->value) && $user->organizations->contains($organizationMember->organization_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OrganizationMember $organizationMember): bool
    {
        return (
            $user->can(OrganizationMemberPermissions::DELETE->value) &&
            $user->organizations->contains($organizationMember->organization_id) ||
            $organizationMember->user_id === $user->id && $organizationMember->organization->user_id === $organizationMember->user_id
        );
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, OrganizationMember $organizationMember): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, OrganizationMember $organizationMember): bool
    {
        return false;
    }
}
