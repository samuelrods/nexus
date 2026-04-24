<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum RolePermissions: string
{
    use ToArrayEnum;

    case READ = 'read-roles';
    case CREATE = 'create-roles';
    case UPDATE = 'update-roles';
    case DELETE = 'delete-roles';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Roles',
            self::CREATE => 'Create Roles',
            self::UPDATE => 'Update Roles',
            self::DELETE => 'Delete Roles',
        };
    }
}
