<?php

namespace App\Services;

use App\Models\BerthRate;
use Illuminate\Support\Facades\DB;

class BerthRateService
{
    public function create(array $data): BerthRate
    {
        return DB::transaction(fn () => BerthRate::create([
            'hourly_berth_rate' => round((float) $data['hourly_berth_rate'], 2),
        ]));
    }
}