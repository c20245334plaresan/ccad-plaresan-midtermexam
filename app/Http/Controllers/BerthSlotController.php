<?php

namespace App\Http\Controllers;

use App\Models\BerthSlot;
use App\Services\BerthSlotService;
use App\Http\Requests\StoreBerthSlotRequest;
use App\Http\Requests\UpdateBerthSlotRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BerthSlotController extends Controller
{
    protected $berthSlotService;

    public function __construct(BerthSlotService $berthSlotService)
    {
        $this->berthSlotService = $berthSlotService;
    }

    // DISPLAY BERTH SLOTS
    public function index(): Response
    {
        $berthSlots = BerthSlot::with('vesselDockings')
            ->withCount('vesselDockings')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('berth-slots/index', [
            'berthSlots' => $berthSlots,
        ]);
    }

    // CREATE FORM
    public function create(): Response
    {
        return Inertia::render('berth-slots/create');
    }

    // STORE BERTH SLOT
    public function store(StoreBerthSlotRequest $request): RedirectResponse
    {
        $this->berthSlotService->create(
            $request->validated()
        );

        return redirect()
            ->route('vessel-dockings.create')
            ->with('success', 'Berth slot created successfully.');
    }

    // UPDATE BERTH SLOT
    public function update(UpdateBerthSlotRequest $request, int $berth_slot): RedirectResponse
    {
        $berthSlot = BerthSlot::findOrFail($berth_slot);

        $this->berthSlotService->update(
            $berthSlot,
            $request->validated()
        );

        return redirect()
            ->route('berth-slots.index')
            ->with('success', 'Berth slot updated successfully.');
    }
}