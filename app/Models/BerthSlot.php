<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BerthSlot extends Model
{
    protected $fillable = [
        'berth_slot',
        'status',
    ];

    public function vesselDockings(): HasMany
    {
        return $this->hasMany(VesselDocking::class);
    }
}