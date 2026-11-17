<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVesselDockingRequest extends FormRequest
{
   
    public function rules(): array
    {
        return [
            'departure_time' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'departure_time.required' => 'Departure time is required.',
            'departure_time.date' => 'Enter a valid departure date and time.',
        ];
    }
}