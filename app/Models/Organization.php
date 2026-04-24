<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Organization extends Model
{
    use HasFactory, Searchable;

    protected $fillable = ['name', 'user_id', 'currency', 'slug', 'created_at'];

    public $timestamps = true;

    protected static function booted()
    {
        static::creating(function ($organization) {
            if (! $organization->slug) {
                $organization->slug = Str::slug($organization->name);

                // Ensure uniqueness
                $originalSlug = $organization->slug;
                $count = 1;
                while (static::where('slug', $organization->slug)->exists()) {
                    $organization->slug = $originalSlug.'-'.$count++;
                }
            }
        });
    }

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where($field ?? 'slug', $value)->first() ?? $value;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_members');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(OrganizationMember::class);
    }

    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function companies(): HasMany
    {
        return $this->hasMany(Company::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function deals(): HasMany
    {
        return $this->hasMany(Deal::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }
}
