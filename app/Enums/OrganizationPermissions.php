<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum OrganizationPermissions: string
{
    use ToArrayEnum;

    case UPDATE = 'update-organization';

    public function label(): string
    {
        return match ($this) {
            static::UPDATE => 'Update Organization',
        };
    }
}
