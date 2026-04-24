<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDealRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lead_id' => 'required|integer|exists:leads,id',
            'contact_id' => 'required|integer|exists:contacts,id',
            'company_id' => 'required|integer|exists:companies,id',
            'name' => 'required|string',
            'value' => 'required|numeric',
            'close_date' => 'required|date',
            'status' => 'required|string',
            'description' => 'required|string',
        ];
    }
}
