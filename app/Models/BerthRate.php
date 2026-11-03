<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BerthRate extends Model
{
    use HasFactory;

    protected $table = 'berth_rates';

    protected $fillable = [
        'hourly_berth_rate',
        'effective_from',
    ];

    protected function casts(): array
    {
        return [
            'hourly_berth_rate' => 'decimal:2',
            'effective_from' => 'date',
        ];
    }

    public function vesselDockings(): HasMany
    {
        return $this->hasMany(VesselDocking::class);
    }
}
