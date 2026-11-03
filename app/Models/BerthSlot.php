<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BerthSlot extends Model
{
    use HasFactory;

    protected $table = 'berth_slots';

    protected $fillable = [
        'slot_code',
        'status',
    ];

    public function vesselDockings(): HasMany
    {
        return $this->hasMany(VesselDocking::class);
    }
}
