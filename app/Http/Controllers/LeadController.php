<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Http\Resources\LeadDataResource;
use App\Http\Resources\LeadResource;
use App\Models\Lead;
use App\Models\Company;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, \App\Models\Organization $organization)
    {
        $this->authorize('viewAny', Lead::class);

        $organizationId = $organization->id;

        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'desc');
        $status = $request->input('status');
        $source = $request->input('source');

        $sortQuery = $sortBy;
        if ($sortBy === 'company_name') {
            $sortQuery = Company::select('name')->whereColumn('companies.id', 'leads.company_id');
        } elseif ($sortBy === 'contact_fullname') {
            $sortQuery = Contact::selectRaw("CONCAT(first_name, ' ', last_name)")->whereColumn('contacts.id', 'leads.contact_id');
        }

        if ($request->filled('query')) {
            $searchResults = Lead::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->query(function ($q) use ($sortQuery, $sortDir, $status, $source) {
                    $q->orderBy($sortQuery, $sortDir);
                    if ($status) $q->where('status', $status);
                    if ($source) $q->where('source', $source);
                })
                ->paginate(10)->withQueryString();

            return Inertia::render('Leads/Index', [
                'pagination' => LeadResource::collection($searchResults),
                'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'status', 'source']),
            ]);
        }

        $leadsPagination = Lead::where('organization_id', $organizationId)
            ->when($status, fn($q) => $q->where('status', $status))
            ->when($source, fn($q) => $q->where('source', $source))
            ->orderBy($sortQuery, $sortDir)
            ->paginate(10)->withQueryString();

        return Inertia::render('Leads/Index', [
            'pagination' => LeadResource::collection($leadsPagination),
            'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'status', 'source']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(\App\Models\Organization $organization)
    {
        $this->authorize('create', Lead::class);

        return Inertia::render('Leads/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request, \App\Models\Organization $organization)
    {
        $this->authorize('create', Lead::class);

        $lead = Lead::create([
            ...$request->validated(),
            'organization_id' => $organization->id,
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new LeadResource($lead);
        }

        return redirect()->route('leads.show', $lead->id)->with(['message' => 'Lead created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(\App\Models\Organization $organization, Lead $lead)
    {
        $this->authorize('view', $lead);

        return Inertia::render('Leads/Show', [
            'lead' => new LeadResource($lead),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(\App\Models\Organization $organization, Lead $lead)
    {
        $this->authorize('update', $lead);

        return Inertia::render('Leads/Edit', [
            'lead' => new LeadResource($lead),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, \App\Models\Organization $organization, Lead $lead)
    {
        $this->authorize('update', $lead);

        $lead->update($request->validated());

        return redirect()->route('leads.show', $lead->id)->with(['message' => 'Lead updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(\App\Models\Organization $organization, Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return redirect()->route('leads.index')->with(['message' => 'Lead deleted successfully!', 'type' => 'success']);
    }

    public function getLeadsOptions(Request $request, \App\Models\Organization $organization)
    {
        $organizationId = $organization->id;

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
