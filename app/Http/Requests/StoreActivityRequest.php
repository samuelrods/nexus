<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreActivityRequest extends FormRequest
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
            'contact_id' => 'required|integer|exists:contacts,id',
            'lead_id' => 'required|integer|exists:leads,id',
            'type' => ['required', 'string', 'in:call,email,meeting,other'],
            'date' => 'required|date',
            'time' => 'required|date_format:H:i:s',
            'description' => 'required|string',
        ];
    }
}
