<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum UserPermissionsEnum: string
{
    use ToArrayEnum;

    case READ_USERS = 'read-users';
    case CREATE_USERS = 'create-users';
    case UPDATE_USERS = 'update-users';
    case DELETE_USERS = 'delete-users';
    case DELETE_ADMINISTRATORS = 'delete-administrators';
}
