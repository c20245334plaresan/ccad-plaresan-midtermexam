<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vessel extends Model
{
    protected $fillable = [
        'vessel_imo_number',
        'vessel_name',
        'flag_country',
        'vessel_gt',
    ];

    public function vesselDockings(): HasMany
    {
        return $this->hasMany(VesselDocking::class);
    }
}