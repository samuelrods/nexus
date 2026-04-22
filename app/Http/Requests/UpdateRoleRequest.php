<?php

namespace App\Http\Requests;

use App\Models\Permission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
            'name' => [
                Rule::excludeIf($this->name === $this->route('role')->name),
                'required',
                'string',
                'max:255',
                'unique:roles',
                function ($attribute, $value, $fail) {
                    if (strtolower($value) === 'owner' && $this->route('role')->name !== 'owner') {
                        $fail('The role name "owner" is reserved for the system.');
                    }
                },
            ],
            'permissions' => ['required', 'array'],
            'permissions.*' => Rule::in(Permission::get()->pluck('id'))
        ];
    }
}
