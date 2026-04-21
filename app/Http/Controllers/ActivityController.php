<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Activity::class);

        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $searchResults = Activity::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Activities', [
                'pagination' => ActivityResource::collection($searchResults),
            ]);
        }

        $activitiesPagination = Activity::where('organization_id', $organizationId)
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Activities', [
            'pagination' => ActivityResource::collection($activitiesPagination),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActivityRequest $request)
    {
        $this->authorize('create', Activity::class);

        Activity::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
            'user_id' => auth()->id(),
        ]);

        return back()->with(['message' => 'Activity created successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        $this->authorize('update', $activity);

        $activity->update($request->validated());

        return back()->with(['message' => 'Activity updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);

        $activity->delete();

        return back()->with(['message' => 'Activity deleted successfully!', 'type' => 'success']);
    }
}
