<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDealRequest;
use App\Http\Requests\UpdateDealRequest;
use App\Http\Resources\DealResource;
use App\Models\Deal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Deal::class);

        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $searchResults = Deal::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Deals/Index', [
                'pagination' => DealResource::collection($searchResults),
            ]);
        }

        $dealsPagination = Deal::where('organization_id', $organizationId)
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Deals/Index', [
            'pagination' => DealResource::collection($dealsPagination),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Deal::class);

        return Inertia::render('Deals/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDealRequest $request)
    {
        $this->authorize('create', Deal::class);

        $deal = Deal::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
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
    public function show(Deal $deal)
    {
        $this->authorize('view', $deal);

        return Inertia::render('Deals/Show', [
            'deal' => new DealResource($deal),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Deal $deal)
    {
        $this->authorize('update', $deal);

        return Inertia::render('Deals/Edit', [
            'deal' => new DealResource($deal),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDealRequest $request, Deal $deal)
    {
        $this->authorize('update', $deal);

        $deal->update($request->validated());

        return redirect()->route('deals.show', $deal->id)->with(['message' => 'Deal updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deal $deal)
    {
        $this->authorize('delete', $deal);

        $deal->delete();

        return redirect()->route('deals.index')->with(['message' => 'Deal deleted successfully!', 'type' => 'success']);
    }
}
