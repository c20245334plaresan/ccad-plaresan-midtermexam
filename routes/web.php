<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BerthSlotController;
use App\Http\Controllers\BerthRateController;
use App\Http\Controllers\VesselDockingController;

use App\Models\BerthSlot;
use App\Models\Payment;
use App\Models\Vessel;
use App\Models\VesselDocking;
use Inertia\Inertia;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware('auth')->group(function () {
    Route::resource('berth-slots', BerthSlotController::class)
        ->only(['index', 'create', 'store', 'update']);

    Route::resource('vessel-dockings', VesselDockingController::class)
        ->only(['index', 'create', 'store', 'update']);

    Route::get('berth-rates/create', [BerthRateController::class, 'create'])
        ->name('berth-rates.create');
    Route::post('berth-rates', [BerthRateController::class, 'store'])
        ->name('berth-rates.store');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';

Route::get('/dashboard', function () {
    $recentDockings = VesselDocking::with(['vessel', 'berthSlot'])
        ->latest('arrival_time')
        ->take(6)
        ->get()
        ->map(fn (VesselDocking $docking) => [
            'id' => $docking->id,
            'vessel' => $docking->vessel->vessel_name,
            'berth' => $docking->berthSlot->berth_slot,
            'arrival' => $docking->arrival_time->format('M j, Y H:i'),
            'departure' => $docking->departure_time?->format('M j, Y H:i'),
            'fee' => (float) $docking->total_berth_fee,
        ]);

    return Inertia::render('dashboard', [
        'stats' => [
            'vessels' => Vessel::count(),
            'availableBerths' => BerthSlot::where('status', 'Available')->count(),
            'occupiedBerths' => BerthSlot::where('status', 'Occupied')->count(),
            'activeDockings' => VesselDocking::whereNull('departure_time')->count(),
            'paidTotal' => (float) Payment::where('payment_status', 'Paid')->sum('amount_paid'),
            'pendingPayments' => Payment::whereIn('payment_status', ['Pending', 'Unpaid'])->count(),
            'arrivalsToday' => VesselDocking::whereDate('arrival_time', today())->count(),
        ],
        'recentDockings' => $recentDockings,
    ]);
})->middleware('auth')->name('dashboard');

    