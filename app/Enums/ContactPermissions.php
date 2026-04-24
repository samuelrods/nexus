<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum ContactPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-contacts';
    case CREATE = 'create-contacts';
    case UPDATE = 'update-contacts';
    case DELETE = 'delete-contacts';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Contacts',
            self::CREATE => 'Create Contacts',
            self::UPDATE => 'Update Contacts',
            self::DELETE => 'Delete Contacts',
        };
    }
}
