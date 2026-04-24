<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcceptInvitationRequest extends FormRequest
{
    public function authorize()
    {
        $invitation = $this->route('invitation');

        // Only authorize if the invitation is for the current user
        return $invitation->user_id === auth()->user()->id;
    }

    public function rules()
    {
        return [
            'status' => ['required', 'boolean'],
        ];
    }

    public function messages()
    {
        return [
            'authorize' => 'The invitation you are trying to accept is not for you.',
        ];
    }
}
