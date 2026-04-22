<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DealResource extends JsonResource
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
            'name' => $this->name,
            'value' => $this->value,
            'currency' => $this->organization->currency,
            'close_date' => $this->close_date,
            'status' => $this->status,
            'description' => $this->description,
            'company_name' => $this->company?->name,
            'company_id' => $this->company_id,
            'contact_fullname' => $this->contact?->fullName,
            'contact_id' => $this->contact_id,
            'lead_description' => $this->lead?->description,
            'lead_id' => $this->lead_id,
            'created_at' => $this->created_at,
        ];
    }
}
