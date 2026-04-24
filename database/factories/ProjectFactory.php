<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
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
            'deadline' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'client_id' => Client::factory(),
            'status' => fake()->randomElement([
                'In Process',
                'Completed',
                'On Hold',
                'Cancelled',
                'Pending Approval',
            ]),
        ];
    }
}
