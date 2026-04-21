<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $client = $this->route('client');
        return [
            'company' => ['exclude_if:company,' . ($client ? $client->company : ''), 'required', 'string', 'max:255'],
            'vat' => ['exclude_if:vat,' . ($client ? $client->vat : ''), 'required', 'integer', 'between:1000,99999'],
            'street_address' => ['exclude_if:street_address,' . ($client && $client->address ? $client->address->street_address : ''), 'required', 'string', 'max:255'],
            'city' => ['exclude_if:city,' . ($client && $client->address ? $client->address->city : ''), 'required', 'string', 'max:255'],
            'state' => ['exclude_if:state,' . ($client && $client->address ? $client->address->state : ''), 'required', 'string', 'max:255'],
            'zip_code' => ['exclude_if:zip_code,' . ($client && $client->address ? $client->address->zip_code : ''), 'required', 'string', 'regex:/^\d{5}(-\d{4})?$/'],
        ];
    }
}
