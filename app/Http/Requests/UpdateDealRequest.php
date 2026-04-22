<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDealRequest extends FormRequest
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
        return [
            'lead_id' => 'sometimes|integer|exists:leads,id',
            'contact_id' => 'sometimes|integer|exists:contacts,id',
            'company_id' => 'sometimes|integer|exists:companies,id',
            'name' => 'sometimes|string',
            'value' => 'sometimes|numeric',
            'close_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'description' => 'sometimes|string',
        ];
    }
}
