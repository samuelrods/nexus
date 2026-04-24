<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum ActivityPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-activities';
    case CREATE = 'create-activities';
    case UPDATE = 'update-activities';
    case DELETE = 'delete-activities';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Activities',
            self::CREATE => 'Create Activities',
            self::UPDATE => 'Update Activities',
            self::DELETE => 'Delete Activities',
        };
    }
}
