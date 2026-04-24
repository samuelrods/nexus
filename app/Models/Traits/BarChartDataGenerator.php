<?php

namespace App\Models\Traits;

trait BarChartDataGenerator
{
    /**
     * Get user count data for the last 7 days.
     *
     * @return array<string, array<string, int>>
     */
    public static function getCountChartDataForWeek()
    {
        $weekStartDate = now()->startOfWeek();
        $weekDates = generateDateRange($weekStartDate, now());

        $countsByDay = $weekDates->mapWithKeys(function ($date) {
            $formattedDate = $date->dayName;

            $totalDay = self::whereDate('created_at', '<=', $date)->count();
            $totalNew = self::whereDate('created_at', $date)->count();

            return [
                $formattedDate => compact('totalDay', 'totalNew'),
            ];
        })->all();

        return $countsByDay;
    }
}
