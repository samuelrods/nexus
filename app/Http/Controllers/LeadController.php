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

            return Inertia::render('Leads', [
                'pagination' => LeadResource::collection($searchResults),
            ]);
        }

        $leadsPagination = Lead::where('organization_id', $organizationId)
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Leads', [
            'pagination' => LeadResource::collection($leadsPagination),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeadRequest $request)
    {
        $this->authorize('create', Lead::class);

        Lead::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
        ]);

        return back()->with(['message' => 'Lead created successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $this->authorize('update', $lead);

        $lead->update($request->validated());

        return back()->with(['message' => 'Lead updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lead $lead)
    {
        $this->authorize('delete', $lead);

        $lead->delete();

        return back()->with(['message' => 'Lead deleted successfully!', 'type' => 'success']);
    }

    public function getLeadsOptions(Request $request)
    {
        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $leads = Lead::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->take(10)
                ->get();

            return LeadDataResource::collection($leads);
        }

        $leads = Lead::where('organization_id', $organizationId)
            ->orderBy('id')
            ->take(10)
            ->get();

        return LeadDataResource::collection($leads);
    }
}
