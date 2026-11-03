<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vessel extends Model
{
    use HasFactory;

    protected $table = 'vessels';

    protected $primaryKey = 'vessel_imo_number';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'vessel_imo_number',
        'vessel_name',
        'flag_country',
        'vessel_gt',
    ];

    protected function casts(): array
    {
        return [
            'vessel_gt' => 'decimal:2',
        ];
    }

    public function vesselDockings(): HasMany
    {
        return $this->hasMany(
            VesselDocking::class,
            'vessel_imo_number',
            'vessel_imo_number'
        );
    }
}
