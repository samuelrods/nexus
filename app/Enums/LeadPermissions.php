<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum LeadPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-leads';
    case CREATE = 'create-leads';
    case UPDATE = 'update-leads';
    case DELETE = 'delete-leads';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Leads',
            self::CREATE => 'Create Leads',
            self::UPDATE => 'Update Leads',
            self::DELETE => 'Delete Leads',
        };
    }
}
