<?php

namespace Database\Factories;

use App\Models\Deal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Deal>
 */
class DealFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'value' => fake()->numberBetween(1000, 100000),
            'close_date' => fake()->dateTimeBetween('-90 days', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement([
                'pending',
                'won',
                'lost',
            ]),
            'description' => fake()->text(),
        ];
    }
}
