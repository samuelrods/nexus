<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $request->validate([
            'range' => ['sometimes', Rule::in([7, 30, 90, 365])],
        ]);

        $range = $request->input('range', 30);

        $organization = Organization::find(session('organization_id'));

        return Inertia::render('Dashboard', [
            'dealAreaChartData' => fn() => $this->getDealAreaChartData($range),
            'dealPieChartData' => fn() => $this->getDealPieChartData($range),
            'activityPieChartData' => fn() => $this->getActivityPieChartData($range),
            'range' => $range,
            'teamMemberCount' => $organization->members()->count(),
            'totalLeads' => $organization->leads()->count(),
            'totalContacts' => $organization->contacts()->count(),
            'upcomingActivities' => $organization->activities()
                ->where('date', '>=', now()->toDateTimeString())
                ->orderBy('date')
                ->limit(5)
                ->get(),
            'recentLeads' => $organization->leads()
                ->with('contact')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get(),
            'topDeals' => $organization->deals()
                ->where('status', 'pending')
                ->orderBy('value', 'desc')
                ->limit(5)
                ->get(),
        ]);
    }

    protected function getDealAreaChartData(int $range): array
    {
        $organization = Organization::find(session('organization_id'));

        $daysAgo = now()->subDays($range - 1);

        $totalValueRange = $organization->deals()
            ->where('close_date', '>=', $daysAgo)
            ->where('status', 'won')
            ->sum('value');

        $dailyTotals = [];

        for ($data = $daysAgo->copy(); $data <= now(); $data->addDay()) {
            $dailyTotals[] = ['value' => $organization->deals()
                ->where('close_date', $data->format('Y-m-d'))
                ->where('status', 'won')
                ->sum('value'), 'date' => $data->format('j F')];
        }

        // get the percentage in comparison with the previous period
        $previousRange = $organization->deals()
            ->where('close_date', '>=', $daysAgo->copy()->subDays($range))
            ->where('close_date', '<', $daysAgo)
            ->sum('value');


        $percentage = $previousRange ? (($totalValueRange - $previousRange) / $previousRange) * 100 : 0;

        return [
            'total' => $totalValueRange,
            'dailyTotals' => $dailyTotals,
            'percentage' => $percentage,
        ];
    }

    protected function getDealPieChartData(int $range): array
    {
        $organization = Organization::find(session('organization_id'));

        $daysAgo = now()->subDays($range - 1);

        $statuses = ['pending', 'won', 'lost'];

        $numOfDealsByStatus = $organization->deals()
            ->select('status', DB::raw('count(*) as total'))
            ->where('close_date', '>=', $daysAgo)
            ->whereIn('status', $statuses)
            ->groupBy('status')
            ->pluck('total', 'status');

        return $numOfDealsByStatus->toArray();
    }

    protected function getActivityPieChartData(int $range): array
    {
        $organization = Organization::find(session('organization_id'));

        $daysAgo = now()->subDays($range - 1);

        $types = ['call', 'meeting', 'email', 'other'];

        $numOfActivitiesByType = $organization->activities()
            ->select('type', DB::raw('count(*) as total'))
            ->where('date', '>=', $daysAgo)
            ->whereIn('type', $types)
            ->groupBy('type')
            ->pluck('total', 'type');

        return $numOfActivitiesByType->toArray();
    }
}
