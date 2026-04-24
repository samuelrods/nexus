<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateContactRequest extends FormRequest
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
            'first_name' => ['sometimes', 'required', 'max:255'],
            'last_name' => ['sometimes', 'required', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'phone_number' => ['sometimes', 'required', 'max:255'],
            'organization_name' => ['sometimes', 'required', 'max:255'],
            'job_title' => ['sometimes', 'required', 'max:255'],
            'description' => ['sometimes', 'required', 'max:255'],
        ];
    }
}
