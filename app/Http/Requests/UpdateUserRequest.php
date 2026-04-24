<?php

namespace App\Http\Requests;

use App\Enums\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class UpdateUserRequest extends FormRequest
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
        $user = $this->route('user');

        return [
            'name' => [Rule::excludeIf($this->name === $user->name), 'required', 'string', 'max:255'],
            'email' => [Rule::excludeIf($this->email === $user->email), 'required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => [Rule::excludeIf(! $this->filled('password')), 'confirmed', Rules\Password::defaults()],
            'role' => [Rule::enum(RolesEnum::class), [Rule::excludeIf($this->role === ($user->roles->first()->name ?? null))], 'required'],
        ];
    }
}
