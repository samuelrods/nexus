<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum CompanyPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-companies';
    case CREATE = 'create-companies';
    case UPDATE = 'update-companies';
    case DELETE = 'delete-companies';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Companies',
            self::CREATE => 'Create Companies',
            self::UPDATE => 'Update Companies',
            self::DELETE => 'Delete Companies',
        };
    }
}
