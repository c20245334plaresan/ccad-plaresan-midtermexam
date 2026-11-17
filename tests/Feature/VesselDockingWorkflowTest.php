<?php

namespace Tests\Feature;

use App\Models\BerthRate;
use App\Models\BerthSlot;
use App\Models\Payment;
use App\Models\Vessel;
use App\Models\VesselDocking;
use App\Models\User;
use App\Services\VesselDockingService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VesselDockingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_arrival_and_departure_update_related_records_and_calculate_the_fee(): void
    {
        $slot = BerthSlot::create([
            'berth_slot' => 'A-01',
            'status' => 'Available',
        ]);
        $rate = BerthRate::create(['hourly_berth_rate' => 100]);

        $docking = app(VesselDockingService::class)->create([
            'vessel_imo_number' => ' 1234567 ',
            'vessel_name' => '  Harbor Star  ',
            'flag_country' => '  Philippines  ',
            'vessel_gt' => 2000,
            'berth_slot_id' => $slot->id,
            'berth_rate_id' => $rate->id,
            'arrival_time' => '2026-11-10 10:00:00',
        ]);

        $this->assertSame('1234567', $docking->vessel->vessel_imo_number);
        $this->assertSame('Harbor Star', $docking->vessel->vessel_name);
        $this->assertSame('Occupied', $slot->refresh()->status);
        $this->assertSame('Pending', $docking->payment->payment_status);

        $docking = app(VesselDockingService::class)->update($docking, [
            'departure_time' => '2026-11-10 13:30:00',
        ]);

        $this->assertSame(3.5, (float) $docking->total_hours);
        $this->assertSame(700.0, (float) $docking->total_berth_fee);
        $this->assertSame('Available', $slot->refresh()->status);
        $this->assertSame('Pending', $docking->payment->payment_status);
        $this->assertSame(0.0, (float) $docking->payment->amount_paid);
    }

    public function test_active_dockings_show_estimated_hours_and_fee(): void
    {
        Carbon::setTestNow('2026-11-10 11:30:00');
        $this->actingAs(User::factory()->create());

        $slot = BerthSlot::create([
            'berth_slot' => 'A-03',
            'status' => 'Available',
        ]);
        $rate = BerthRate::create(['hourly_berth_rate' => 100]);

        app(VesselDockingService::class)->create([
            'vessel_imo_number' => '2345678',
            'vessel_name' => 'Harbor Light',
            'flag_country' => 'Philippines',
            'vessel_gt' => 2000,
            'berth_slot_id' => $slot->id,
            'berth_rate_id' => $rate->id,
            'arrival_time' => '2026-11-10 10:00:00',
        ]);

        $this->get('/vessel-dockings')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('dockings.data.0.estimated_total_hours', 1.5)
                ->where('dockings.data.0.estimated_total_berth_fee', 300));

        Carbon::setTestNow();
    }

    public function test_docking_pages_render_through_inertia(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/berth-slots')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('berth-slots/index')
                ->has('berthSlots.data'));

        $this->get('/vessel-dockings/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('vessel-dockings/create')
                ->has('berthSlots')
                ->has('berthRates'));
    }

    public function test_user_can_add_a_rate_from_the_docking_setup_flow(): void
    {
        $this->actingAs(User::factory()->create());

        $this->get('/berth-rates/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('berth-rates/create')
                ->has('berthRates'));

        $this->post('/berth-rates', ['hourly_berth_rate' => '125.50'])
            ->assertRedirect('/vessel-dockings/create');

        $this->assertDatabaseHas('berth_rates', [
            'hourly_berth_rate' => '125.50',
        ]);
    }

    public function test_departure_must_be_later_than_arrival(): void
    {
        $slot = BerthSlot::create([
            'berth_slot' => 'A-02',
            'status' => 'Available',
        ]);
        $rate = BerthRate::create(['hourly_berth_rate' => 100]);
        $docking = app(VesselDockingService::class)->create([
            'vessel_imo_number' => '7654321',
            'vessel_name' => 'Coastal Runner',
            'flag_country' => 'Philippines',
            'vessel_gt' => 1000,
            'berth_slot_id' => $slot->id,
            'berth_rate_id' => $rate->id,
            'arrival_time' => '2026-11-10 10:00:00',
        ]);

        try {
            app(VesselDockingService::class)->update($docking, [
                'departure_time' => '2026-11-10 09:00:00',
            ]);
            $this->fail('Expected earlier departure to be rejected.');
        } catch (\Illuminate\Validation\ValidationException $exception) {
            $this->assertArrayHasKey('departure_time', $exception->errors());
        }

        $this->assertNull($docking->refresh()->departure_time);
        $this->assertSame('Occupied', $slot->refresh()->status);
        $this->assertSame(1, Vessel::count());
        $this->assertSame(1, VesselDocking::count());
        $this->assertSame(1, Payment::count());
    }
}