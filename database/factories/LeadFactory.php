<?php

namespace Database\Factories;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'source' => fake()->randomElement([
                'website',
                'referral',
                'social_media',
                'other',
            ]),
            'created_at' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement([
                'open',
                'closed',
                'converted',
            ]),
            'description' => fake()->text(),
        ];
    }
}
