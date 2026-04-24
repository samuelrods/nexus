<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum RolesEnum: string
{
    use ToArrayEnum;

    case SUPER = 'super administrator';
    case ADMINISTRATOR = 'administrator';
    case SALES = 'sales-representative';
    case SUPPORT = 'customer-support';
    case MARKETING = 'marketing-professional';
    case ANALYST = 'analyst';

    public function label(): string
    {
        return match ($this) {
            self::SUPER => 'Super Administrators',
            self::ADMINISTRATOR => 'Administrators',
            self::SALES => 'Sales Representatives',
            self::SUPPORT => 'Customer Supports',
            self::MARKETING => 'Marketing Professionals',
            self::ANALYST => 'Analysts',
        };
    }
}
