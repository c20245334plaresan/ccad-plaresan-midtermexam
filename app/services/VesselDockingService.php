<?php

namespace App\Services;

use App\Models\BerthRate;
use App\Models\BerthSlot;
use App\Models\Payment;
use App\Models\Vessel;
use App\Models\VesselDocking;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VesselDockingService
{
    /**
     * @return array{total_hours: float, total_berth_fee: float}
     */
    public function estimate(VesselDocking $docking, Carbon $asOf): array
    {
        $arrival = Carbon::parse($docking->arrival_time);
        $totalHours = round(
            max(0, $arrival->diffInMinutes($asOf, false)) / 60,
            2
        );

        return [
            'total_hours' => $totalHours,
            'total_berth_fee' => $this->calculateTotalFee(
                $totalHours,
                $docking->berthRate,
                $docking->vessel
            ),
        ];
    }

    public function create(array $data): VesselDocking
    {
        return DB::transaction(function () use ($data) {
            $imo = preg_replace(
                '/\s+/',
                '',
                Str::upper(trim($data['vessel_imo_number']))
            );

            if (! preg_match('/^[0-9]{7}$/', $imo)) {
                throw ValidationException::withMessages([
                    'vessel_imo_number' => 'Vessel IMO number must contain exactly 7 digits.',
                ]);
            }

            $slot = BerthSlot::whereKey($data['berth_slot_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if ($slot->status !== 'Available') {
                throw ValidationException::withMessages([
                    'berth_slot_id' => 'Selected berth slot is not available.',
                ]);
            }

            $rate = BerthRate::findOrFail($data['berth_rate_id']);

            if ((float) $rate->hourly_berth_rate <= 0) {
                throw ValidationException::withMessages([
                    'berth_rate_id' => 'The selected berth rate must be greater than zero.',
                ]);
            }

            $vessel = Vessel::updateOrCreate(
                ['vessel_imo_number' => $imo],
                [
                    'vessel_name' => trim($data['vessel_name']),
                    'flag_country' => trim($data['flag_country']),
                    'vessel_gt' => $data['vessel_gt'],
                ]
            );

            $docking = VesselDocking::create([
                'vessel_id' => $vessel->id,
                'berth_slot_id' => $slot->id,
                'berth_rate_id' => $rate->id,
                'arrival_time' => $data['arrival_time'],
                'departure_time' => null,
                'total_hours' => 0,
                'total_berth_fee' => 0,
            ]);

            $slot->update(['status' => 'Occupied']);

            Payment::create([
                'vessel_docking_id' => $docking->id,
                'payment_status' => 'Pending',
                'amount_paid' => 0,
            ]);

            return $docking->load(['vessel', 'berthSlot', 'berthRate', 'payment']);
        });
    }

    public function update(VesselDocking $docking, array $data): VesselDocking
    {
        return DB::transaction(function () use ($docking, $data) {
            $docking = VesselDocking::whereKey($docking->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($docking->departure_time !== null) {
                throw ValidationException::withMessages([
                    'departure_time' => 'This vessel has already departed.',
                ]);
            }

            $arrival = Carbon::parse($docking->arrival_time);
            $departure = Carbon::parse($data['departure_time']);

            if ($departure->lessThanOrEqualTo($arrival)) {
                throw ValidationException::withMessages([
                    'departure_time' => 'Departure must be later than arrival.',
                ]);
            }

            $totalHours = round($arrival->diffInMinutes($departure) / 60, 2);
            $vessel = Vessel::findOrFail($docking->vessel_id);
            $rate = BerthRate::findOrFail($docking->berth_rate_id);
            $totalFee = $this->calculateTotalFee($totalHours, $rate, $vessel);

            $slot = BerthSlot::whereKey($docking->berth_slot_id)
                ->lockForUpdate()
                ->firstOrFail();

            $docking->update([
                'departure_time' => $departure,
                'total_hours' => $totalHours,
                'total_berth_fee' => $totalFee,
            ]);

            $slot->update(['status' => 'Available']);

            $docking->payment()->updateOrCreate(
                ['vessel_docking_id' => $docking->id],
                [
                    'amount_paid' => 0,
                    'payment_status' => 'Pending',
                ]
            );

            return $docking->load(['vessel', 'berthSlot', 'berthRate', 'payment']);
        });
    }

    private function calculateTotalFee(
        float $totalHours,
        BerthRate $rate,
        Vessel $vessel
    ): float {
        return round(
            $totalHours
                * (float) $rate->hourly_berth_rate
                * ((int) $vessel->vessel_gt / 1000),
            2
        );
    }
}