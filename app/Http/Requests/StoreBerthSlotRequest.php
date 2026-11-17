<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreBerthSlotRequest extends FormRequest
{
   
    public function rules(): array
    {
        return [
            'berth_slot' => [
                'required',
                'string',
                'max:100',
                'unique:berth_slots,berth_slot'
            ],

        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'berth_slot' => Str::upper(trim((string) $this->input('berth_slot'))),
        ]);
    }

    public function messages(): array
    {
        return [
            'berth_slot.required' => 'Berth slot is required.',
            'berth_slot.unique' => 'This berth slot already exists.',
            'berth_slot.max' => 'Berth slot cannot exceed 1000 characters.',
        ];
    }
}