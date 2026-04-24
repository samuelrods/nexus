<?php

namespace Database\Factories;

use App\Enums\TaskStatus;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->word(),
            'description' => fake()->text(),
            'due_date' => fake()->dateTimeBetween('+1 day', '+1 week')->format('Y-m-d'),
            'status' => fake()->randomElement(TaskStatus::toArray()),
        ];
    }
}
