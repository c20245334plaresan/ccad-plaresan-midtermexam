use App\Http\Controllers\VesselDockingController;

Route::get('/dockings', [
    VesselDockingController::class,
    'index'
])->name('dockings.index');

Route::post('/dockings', [
    VesselDockingController::class,
    'store'
])->name('dockings.store');

Route::post('/dockings/{id}/departure', [
    VesselDockingController::class,
    'departure'
])->name('dockings.departure');

