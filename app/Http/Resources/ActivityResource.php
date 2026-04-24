<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contact_fullname' => $this->contact?->fullName,
            'contact_id' => $this->contact_id,
            'type' => $this->type,
            'date' => $this->date,
            'time' => $this->time,
            'description' => $this->description,
            'lead_id' => $this->lead_id,
            'lead_description' => $this->lead?->description,
            'created_at' => $this->created_at,
        ];
    }
}
