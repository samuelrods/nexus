<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDealRequest;
use App\Http\Requests\UpdateDealRequest;
use App\Http\Resources\DealResource;
use App\Models\Deal;
use App\Models\Organization;
use App\Models\Company;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Organization $organization)
    {
        $this->authorize('viewAny', Deal::class);

        $organizationId = $organization->id;

        $stats = [
            'total_deals' => Deal::where('organization_id', $organizationId)->count(),
            'total_value' => Deal::where('organization_id', $organizationId)->sum('value'),
            'won_deals' => Deal::where('organization_id', $organizationId)->where('status', 'won')->count(),
            'pending_deals' => Deal::where('organization_id', $organizationId)->where('status', 'pending')->count(),
        ];

        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'desc');
        $status = $request->input('status');

        $sortQuery = $sortBy;
        if ($sortBy === 'company_name') {
            $sortQuery = Company::select('name')->whereColumn('companies.id', 'deals.company_id');
        } elseif ($sortBy === 'contact_fullname') {
            $sortQuery = Contact::selectRaw("CONCAT(first_name, ' ', last_name)")->whereColumn('contacts.id', 'deals.contact_id');
        }

        if ($request->filled('query')) {
            $searchResults = Deal::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->query(function ($q) use ($sortQuery, $sortDir, $status) {
                    $q->orderBy($sortQuery, $sortDir);
                    if ($status) $q->where('status', $status);
                })
                ->paginate(10)->withQueryString();

            return Inertia::render('Deals/Index', [
                'pagination' => DealResource::collection($searchResults),
                'stats' => $stats,
                'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'status']),
            ]);
        }

        $dealsPagination = Deal::where('organization_id', $organizationId)
            ->when($status, fn($q) => $q->where('status', $status))
            ->orderBy($sortQuery, $sortDir)
            ->paginate(10)->withQueryString();

        return Inertia::render('Deals/Index', [
            'pagination' => DealResource::collection($dealsPagination),
            'stats' => $stats,
            'filters' => $request->only(['query', 'sort_by', 'sort_dir', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $this->authorize('create', Deal::class);

        return Inertia::render('Deals/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDealRequest $request, Organization $organization)
    {
        $this->authorize('create', Deal::class);

        $deal = Deal::create([
            ...$request->validated(),
            'organization_id' => $organization->id,
            'user_id' => auth()->id(),
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new DealResource($deal);
        }

        return redirect()->route('deals.show', $deal->id)->with(['message' => 'Deal created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Deal $deal)
    {
        $this->authorize('view', $deal);

        return Inertia::render('Deals/Show', [
            'deal' => new DealResource($deal),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Deal $deal)
    {
        $this->authorize('update', $deal);

        return Inertia::render('Deals/Edit', [
            'deal' => new DealResource($deal),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDealRequest $request, Organization $organization, Deal $deal)
    {
        $this->authorize('update', $deal);

        $deal->update($request->validated());

        return redirect()->route('deals.show', $deal->id)->with(['message' => 'Deal updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Deal $deal)
    {
        $this->authorize('delete', $deal);

        $deal->delete();

        return redirect()->route('deals.index')->with(['message' => 'Deal deleted successfully!', 'type' => 'success']);
    }
}
