<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Http\Resources\LeadDataResource;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Lead::class);

        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $searchResults = Lead::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Leads/Index', [
                'pagination' => LeadResource::collection($searchResults),
            ]);
        }

        $leadsPagination = Lead::where('organization_id', $organizationId)
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Leads/Index', [
            'pagination' => LeadResource::collection($leadsPagination),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Lead::class);

        return Inertia::render('Leads/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request)
    {
        $this->authorize('create', Lead::class);

        $lead = Lead::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new LeadResource($lead);
        }

        return redirect()->route('leads.show', $lead->id)->with(['message' => 'Lead created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Lead $lead)
    {
        $this->authorize('view', $lead);

        return Inertia::render('Leads/Show', [
            'lead' => new LeadResource($lead),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lead $lead)
    {
        $this->authorize('update', $lead);

        return Inertia::render('Leads/Edit', [
            'lead' => new LeadResource($lead),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $this->authorize('update', $lead);

        $lead->update($request->validated());

        return redirect()->route('leads.show', $lead->id)->with(['message' => 'Lead updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return redirect()->route('leads.index')->with(['message' => 'Lead deleted successfully!', 'type' => 'success']);
    }

    public function getLeadsOptions(Request $request)
    {
        $organizationId = session('organization_id');

        $query = Lead::where('organization_id', $organizationId);

        if ($request->filled('query')) {
            $searchTerm = '%' . $request->input('query') . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('description', 'like', $searchTerm)
                    ->orWhereHas('company', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', $searchTerm);
                    });
            });
        }

        $leads = $query->orderBy('id')->take(10)->get();

        return LeadDataResource::collection($leads);
    }
}
