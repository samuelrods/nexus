<?php

namespace App\Policies;

use App\Enums\MemberPermissions;
use App\Models\OrganizationMember;
use App\Models\User;

class OrganizationMemberPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can(MemberPermissions::READ->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, OrganizationMember $organizationMember): bool
    {
        return $user->can(MemberPermissions::READ->value) && $user->organizations->contains($organizationMember->organization_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(MemberPermissions::CREATE->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, OrganizationMember $organizationMember): bool
    {
        return $user->can(MemberPermissions::UPDATE->value) && $user->organizations->contains($organizationMember->organization_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, OrganizationMember $organizationMember): bool
    {
        return
            $user->can(MemberPermissions::DELETE->value) &&
            $user->organizations->contains($organizationMember->organization_id);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, OrganizationMember $organizationMember): bool
    {
        return false;
    }

    /**
     * Determine whether the user can force delete the model.
     */
    public function forceDelete(User $user, OrganizationMember $organizationMember): bool
    {
        return false;
    }
}
