<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Scout\Searchable;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory, Searchable;

    // You might set a public property like guard_name or connection, or override other Eloquent Model methods/properties
    protected $fillable = ['name', 'guard_name', 'organization_id'];

    public function toArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'permissions' => $this->permissions->pluck('id'),
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->diffForHumans(),
        ];
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
