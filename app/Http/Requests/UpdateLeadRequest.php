<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLeadRequest extends FormRequest
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
            'company_id' => 'sometimes|exists:companies,id',
            'contact_id' => 'sometimes|exists:contacts,id',
            'status' => ['sometimes', Rule::in(['open', 'closed', 'converted'])],
            'source' => ['sometimes', Rule::in(['website', 'referral', 'social_media', 'other'])],
            'description' => 'sometimes|string',
        ];
    }
}
