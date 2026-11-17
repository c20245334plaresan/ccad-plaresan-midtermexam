<?php

namespace Database\Seeders;

use App\Models\BerthRate;
use App\Models\BerthSlot;
use Illuminate\Database\Seeder;

class PortSetupSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['A-01', 'A-02', 'B-01', 'B-02',] as $berth) {
            BerthSlot::firstOrCreate(
                ['berth_slot' => $berth],
                ['status' => 'Available'],
            );
        }

        BerthRate::firstOrCreate([
            'hourly_berth_rate' => 1000.00,
        ]);
    }
}
