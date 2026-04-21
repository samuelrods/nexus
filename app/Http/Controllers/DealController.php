<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDealRequest;
use App\Http\Requests\UpdateDealRequest;
use App\Http\Resources\DealResource;
use App\Models\Deal;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DealController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Deal::class, 'deal');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $searchResults = Deal::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Deals', [
                'pagination' => DealResource::collection($searchResults),
            ]);
        }

        $dealsPagination = Deal::where('organization_id', $organizationId)
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Deals', [
            'pagination' => DealResource::collection($dealsPagination),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDealRequest $request)
    {
        Deal::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
            'user_id' => auth()->id(),
        ]);

        return back()->with(['message' => 'Deal created successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDealRequest $request, Deal $deal)
    {
        $deal->update($request->validated());

        return back()->with(['message' => 'Deal updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Deal $deal)
    {
        $deal->delete();

        return back()->with(['message' => 'Deal deleted successfully!', 'type' => 'success']);
    }
}
