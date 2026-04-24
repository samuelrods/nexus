<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Activity extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'user_id',
        'contact_id',
        'lead_id',
        'type',
        'date',
        'time',
        'description',
        'organization_id',
    ];

    public $timestamps = false;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function toSearchableArray()
    {
        return [
            'id' => (int) $this->id,
            'organization_id' => (int) $this->organization_id,
            'contact_name' => $this->contact->fullName,
        ];
    }
}
