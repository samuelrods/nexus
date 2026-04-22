<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeadResource extends JsonResource
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
            'contact_fullname' => $this->contact->fullName,
            'contact_id' => $this->contact_id,
            'company_name' => $this->company->name,
            'company_id' => $this->company_id,
            'status' => $this->status,
            'source' => $this->source,
            'description' => $this->description,
            'created_at' => $this->created_at,
        ];
    }
}
