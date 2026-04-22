<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActivityRequest;
use App\Http\Requests\UpdateActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Models\Contact;
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

        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'desc');
        $type = $request->input('type');

        $sortQuery = $sortBy;
        if ($sortBy === 'contact_fullname') {
            $sortQuery = Contact::selectRaw("CONCAT(first_name, ' ', last_name)")->whereColumn('contacts.id', 'activities.contact_id');
        }

        if ($request->filled('query')) {
            $searchResults = Activity::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->query(function ($q) use ($sortQuery, $sortDir, $type) {
                    $q->orderBy($sortQuery, $sortDir);
                    if ($type) $q->where('type', $type);
                })
                ->paginate(10)->withQueryString();

            return Inertia::render('Activities/Index', [
                'pagination' => ActivityResource::collection($searchResults),
                'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'type']),
            ]);
        }

        $activitiesPagination = Activity::where('organization_id', $organizationId)
            ->when($type, fn($q) => $q->where('type', $type))
            ->orderBy($sortQuery, $sortDir)
            ->paginate(10)->withQueryString();

        return Inertia::render('Activities/Index', [
            'pagination' => ActivityResource::collection($activitiesPagination),
            'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Activity::class);

        return Inertia::render('Activities/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreActivityRequest $request)
    {
        $this->authorize('create', Activity::class);

        $activity = Activity::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
            'user_id' => auth()->id(),
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new ActivityResource($activity);
        }

        return redirect()->route('activities.show', $activity->id)->with(['message' => 'Activity created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Activity $activity)
    {
        $this->authorize('view', $activity);

        return Inertia::render('Activities/Show', [
            'activity' => new ActivityResource($activity),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Activity $activity)
    {
        $this->authorize('update', $activity);

        return Inertia::render('Activities/Edit', [
            'activity' => new ActivityResource($activity),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateActivityRequest $request, Activity $activity)
    {
        $this->authorize('update', $activity);

        $activity->update($request->validated());

        return redirect()->route('activities.show', $activity->id)->with(['message' => 'Activity updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Activity $activity)
    {
        $this->authorize('delete', $activity);

        $activity->delete();

        return redirect()->route('activities.index')->with(['message' => 'Activity deleted successfully!', 'type' => 'success']);
    }
}
