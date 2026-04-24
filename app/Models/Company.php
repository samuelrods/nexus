<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Company extends Model
{
    use HasFactory, Searchable;

    public $fillable = [
        'name',
        'website',
        'industry',
        'street_address',
        'city',
        'state',
        'zip_code',
        'description',
        'organization_id',
    ];

    public $timestamps = true;

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function toSearchableArray()
    {
        return [
            'id' => (int) $this->id,
            'organization_id' => (int) $this->organization_id,
            'name' => $this->name,
            'industry' => $this->industry,
            'city' => $this->city,
            'state' => $this->state,
        ];
    }
}
