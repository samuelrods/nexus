<?php

namespace App\Http\Resources;

use App\Models\OrganizationMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $this->resource instanceof User ? $this->resource : $this->user;
        $membership = $this->resource instanceof OrganizationMember ? $this->resource : $this->memberships()->where('organization_id', session('organization_id'))->first();

        return [
            'id' => $membership->id,
            'user_id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'full_name' => $user->full_name,
            'role_name' => $user->roles->first()->name ?? null,
            'role_id' => $user->roles->first()->id ?? null,
            'email' => $user->email,
            'membership' => $membership,
        ];
    }
}
