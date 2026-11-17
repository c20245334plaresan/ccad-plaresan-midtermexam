<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreVesselDockingRequest extends FormRequest
{
   
    protected function prepareForValidation(): void
    {
        $this->merge([
            'vessel_imo_number' => preg_replace(
                '/\s+/',
                '',
                Str::upper(trim((string) $this->input('vessel_imo_number')))
            ),
        ]);
    }

    public function rules(): array
    {
        return [
            'vessel_imo_number' => ['required', 'string', 'regex:/^[0-9]{7}$/'],
            'vessel_name' => ['required', 'string', 'max:255'],
            'flag_country' => ['required', 'string', 'max:100'],
            'vessel_gt' => ['required', 'integer', 'min:1'],
            'berth_slot_id' => ['required', 'integer', 'exists:berth_slots,id'],
            'berth_rate_id' => ['required', 'integer', 'exists:berth_rates,id'],
            'arrival_time' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'vessel_imo_number.required' => 'Vessel IMO number is required.',
            'vessel_imo_number.regex' => 'Vessel IMO number must contain exactly 7 digits.',
            'vessel_name.required' => 'Vessel name is required.',
            'flag_country.required' => 'Flag country is required.',
            'vessel_gt.min' => 'Gross tonnage must be greater than zero.',
            'berth_slot_id.exists' => 'Select a berth slot that exists.',
            'berth_rate_id.exists' => 'Select a berth rate that exists.',
            'arrival_time.required' => 'Arrival time is required.',
        ];
    }
}