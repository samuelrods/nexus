<?php

namespace App\Http\Requests;

use App\Enums\TaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $task = $this->route('task');

        return [
            'title' => ['exclude_if:title,'.$task->title, 'required', 'string', 'max:255'],
            'description' => ['exclude_if:description,'.$task->description, 'required', 'string'],
            'due_date' => ['exclude_if:due_date,'.$task->due_date, 'required', 'date_format:Y-m-d'],
            'project_id' => ['exclude_if:project_id,'.$task->project_id, 'required', 'integer', 'exists:projects,id'],
            'status' => ['exclude_if:status,'.$task->status, 'required', 'string', Rule::enum(TaskStatus::class)],
        ];
    }
}
