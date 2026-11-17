<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('vesselDocking.vessel')
            ->latest()
            ->get();

        return Inertia::render('payments/index', [
            'payments' => $payments,
        ]);
    }
}