<?php

namespace App\Models\Traits;

trait DonutChartDataGenerator
{
    public static function getCountChartData()
    {
        $result = self::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['status'] => $item['count']];
            })
            ->all();

        return $result;
    }
}
