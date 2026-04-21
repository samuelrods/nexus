<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
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
            'company_id' => 'required|exists:companies,id',
            'contact_id' => 'required|exists:contacts,id',
            'status' => ['required', Rule::in(['open', 'closed', 'converted'])],
            'source' => ['required', Rule::in(['website', 'referral', 'social_media', 'other'])],
            'description' => 'required|string',
        ];
    }
}
