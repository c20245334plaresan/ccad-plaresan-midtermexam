<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class VesselDocking extends Model
{
    protected $fillable = [
        'vessel_id',
        'berth_slot_id',
        'berth_rate_id',
        'arrival_time',
        'departure_time',
        'total_hours',
        'total_berth_fee',
    ];

    protected function casts(): array
    {
        return [
            'arrival_time' => 'datetime',
            'departure_time' => 'datetime',
            'total_hours' => 'decimal:2',
            'total_berth_fee' => 'decimal:2',
        ];
    }

    public function vessel(): BelongsTo
    {
        return $this->belongsTo(Vessel::class);
    }

    public function berthSlot(): BelongsTo
    {
        return $this->belongsTo(BerthSlot::class);
    }

    public function berthRate(): BelongsTo
    {
        return $this->belongsTo(BerthRate::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }
}