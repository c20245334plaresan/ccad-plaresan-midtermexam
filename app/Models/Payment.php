<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'vessel_docking_id',
        'payment_status',
        'amount_paid',
        'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount_paid' => 'decimal:2',
    ];

    public function vesselDocking(): BelongsTo
    {
        return $this->belongsTo(VesselDocking::class);
    }
}