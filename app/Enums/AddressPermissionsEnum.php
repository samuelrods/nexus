<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum AddressPermissionsEnum: string
{
    use ToArrayEnum;

    case READ_ADDRESSES = 'read-addresses';
    case CREATE_ADDRESSES = 'create-addresses';
    case UPDATE_ADDRESSES = 'update-addresses';
    case DELETE_ADDRESSES = 'delete-addresses';

    public function label(): string
    {
        return match ($this) {
            self::READ_ADDRESSES => 'Read Addresses',
            self::CREATE_ADDRESSES => 'Create Addresses',
            self::UPDATE_ADDRESSES => 'Update Addresses',
            self::DELETE_ADDRESSES => 'Delete Addresses',
        };
    }
}
