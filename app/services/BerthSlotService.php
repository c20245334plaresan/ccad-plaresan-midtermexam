<?php

namespace App\Services;

use App\Models\BerthSlot;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BerthSlotService
{
    public function create(array $data): BerthSlot
    {
        return DB::transaction(function () use ($data) {
            return BerthSlot::create([
                'berth_slot' => Str::upper(trim($data['berth_slot'])),
                'status' => 'Available',
            ]);
        });
    }

    public function update(BerthSlot $berthSlot, array $data): BerthSlot
    {
        return DB::transaction(function () use ($berthSlot, $data) {
            $slot = BerthSlot::whereKey($berthSlot->id)
                ->lockForUpdate()
                ->firstOrFail();

            $slot->update([
                'berth_slot' => Str::upper(trim($data['berth_slot'])),
            ]);

            return $slot->refresh();
        });
    }
}