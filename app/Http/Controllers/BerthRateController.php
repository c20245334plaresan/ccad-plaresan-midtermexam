<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBerthRateRequest;
use App\Models\BerthRate;
use App\Services\BerthRateService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BerthRateController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('berth-rates/create', [
            'berthRates' => BerthRate::orderBy('hourly_berth_rate')->get(),
        ]);
    }

    public function store(StoreBerthRateRequest $request, BerthRateService $service): RedirectResponse
    {
        $service->create($request->validated());

        return redirect()
            ->route('vessel-dockings.create')
            ->with('success', 'Berth rate saved. You can now record the arrival.');
    }
}