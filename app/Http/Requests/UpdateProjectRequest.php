<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $project = $this->route('project');

        return [
            'title' => ['exclude_if:title,'.$project->title, 'required', 'string', 'max:255'],
            'description' => ['exclude_if:description,'.$project->description, 'required', 'string'],
            'deadline' => ['exclude_if:deadline,'.$project->deadline, 'required', 'date_format:Y-m-d'],
            'user_id' => ['exclude_if:user_id,'.$project->user_id, 'required', 'integer', 'exists:users,id'],
            'client_id' => ['exclude_if:client_id,'.$project->client_id, 'required', 'integer', 'exists:clients,id'],
            'status' => ['exclude_if:status,'.$project->status, 'required', 'string', Rule::enum(ProjectStatus::class)],
        ];
    }
}
