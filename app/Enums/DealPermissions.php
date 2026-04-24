<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum DealPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-deals';
    case CREATE = 'create-deals';
    case UPDATE = 'update-deals';
    case DELETE = 'delete-deals';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Deals',
            self::CREATE => 'Create Deals',
            self::UPDATE => 'Update Deals',
            self::DELETE => 'Delete Deals',
        };
    }
}
