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
        'address_id',
        'description',
        'organization_id',
    ];

    public $timestamps = true;

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

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
        ];
    }
}
