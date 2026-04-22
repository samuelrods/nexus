<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class Lead extends Model
{
    use HasFactory, Searchable;

    protected $fillable = [
        'contact_id',
        'company_id',
        'source',
        'created_at',
        'status',
        'description',
        'organization_id'
    ];

    public $timestamps = false;

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function toSearchableArray()
    {
        $array = $this->toArray();

        $array['id'] = (int) $this->id;
        $array['organization_id'] = (int) $this->organization_id;
        $array['company_name'] = $this->company->name;

        return $array;
    }
}
