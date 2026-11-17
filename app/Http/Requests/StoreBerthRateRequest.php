<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBerthRateRequest extends FormRequest
{
  
    public function rules(): array
    {
        return [
            'hourly_berth_rate' => ['required', 'numeric', 'gt:0', 'max:9999999999.99'],
        ];
    }

    public function messages(): array
    {
        return [
            'hourly_berth_rate.required' => 'Enter the hourly berth rate.',
            'hourly_berth_rate.numeric' => 'The hourly berth rate must be a number.',
            'hourly_berth_rate.gt' => 'The hourly berth rate must be greater than zero.',
            'hourly_berth_rate.max' => 'The hourly berth rate is too large.',
        ];
    }
}