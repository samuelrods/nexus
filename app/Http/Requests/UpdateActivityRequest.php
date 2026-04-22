<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->time && strlen($this->time) === 5) {
            $this->merge([
                'time' => $this->time . ':00',
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact_id' => 'sometimes|required|integer|exists:contacts,id',
            'lead_id' => 'sometimes|required|integer|exists:leads,id',
            'type' => ['sometimes', 'required', 'string', 'in:call,email,meeting,other'],
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i:s',
            'description' => 'sometimes|required|string',
        ];
    }
}
