<?php

namespace App\Enums;

use App\Enums\Traits\ToArrayEnum;

enum MemberPermissions: string
{
    use ToArrayEnum;

    case READ = 'read-members';
    case CREATE = 'create-members';
    case UPDATE = 'update-members';
    case DELETE = 'delete-members';

    public function label(): string
    {
        return match ($this) {
            self::READ => 'Read Members',
            self::CREATE => 'Create Members',
            self::UPDATE => 'Update Members',
            self::DELETE => 'Delete Members',
        };
    }
}
