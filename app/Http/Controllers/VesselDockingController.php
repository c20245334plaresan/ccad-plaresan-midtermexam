<?php

namespace App\Http\Controllers;

use App\Models\VesselDocking;
use App\Models\BerthSlot;
use App\Models\BerthRate;
use App\Services\VesselDockingService;
use App\Http\Requests\StoreVesselDockingRequest;
use App\Http\Requests\UpdateVesselDockingRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VesselDockingController extends Controller
{
    protected VesselDockingService $vesselDockingService;

    public function __construct(
        VesselDockingService $vesselDockingService
    ) {
        $this->vesselDockingService = $vesselDockingService;
    }

    /**
     * Display all vessel docking records.
     */
    public function index(): Response
    {
        $dockings = VesselDocking::with([
            'vessel',
            'berthSlot',
            'berthRate',
            'payment'
        ])
            ->latest('arrival_time')
            ->paginate(10)
            ->withQueryString();

        $asOf = now();
        $dockings->through(function (VesselDocking $docking) use ($asOf) {
            if ($docking->departure_time === null) {
                $estimate = $this->vesselDockingService->estimate($docking, $asOf);
                $docking->setAttribute('estimated_total_hours', $estimate['total_hours']);
                $docking->setAttribute('estimated_total_berth_fee', $estimate['total_berth_fee']);
            }

            return $docking;
        });

        return Inertia::render('vessel-dockings/index', [
            'dockings' => $dockings,
        ]);
    }

    /**
     * Display the docking creation form.
     */
    public function create(): Response
    {
        $berthSlots = BerthSlot::where('status', 'Available')
            ->orderBy('berth_slot')
            ->get();

        $berthRates = BerthRate::orderBy('id')->get();

        return Inertia::render('vessel-dockings/create', [
            'berthSlots' => $berthSlots,
            'berthRates' => $berthRates,
        ]);
    }

    /**
     * Store a new vessel docking record.
     */
    public function store(
        StoreVesselDockingRequest $request
    ): RedirectResponse {

        $this->vesselDockingService->create(
            $request->validated()
        );

        return redirect()
            ->route('vessel-dockings.index')
            ->with('success', 'Vessel docking created successfully.');
    }

    /**
     * Record vessel departure and calculate docking fee.
     */
    public function update(
        UpdateVesselDockingRequest $request,
        int $vessel_docking
    ): RedirectResponse {

        $docking = VesselDocking::findOrFail($vessel_docking);

        $this->vesselDockingService->update(
            $docking,
            $request->validated()
        );

        return redirect()
            ->route('vessel-dockings.index')
            ->with('success', 'Vessel departure recorded successfully.');
    }
}
