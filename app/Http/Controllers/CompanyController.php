<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCompanyRequest;
use App\Http\Requests\UpdateCompanyRequest;
use App\Http\Resources\CompanyDataResource;
use App\Http\Resources\CompanyResource;
use App\Models\Address;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Company::class);

        $organizationId = session('organization_id');

        $stats = [
            'total_companies' => Company::where('organization_id', $organizationId)->count(),
            'industries' => Company::where('organization_id', $organizationId)->distinct('industry')->count('industry'),
        ];

        if ($request->filled('query')) {
            $searchResults = Company::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Companies/Index', [
                'pagination' => CompanyResource::collection($searchResults),
                'stats' => $stats,
            ]);
        }

        $companiesPagination = Company::where('organization_id', $organizationId)
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Companies/Index', [
            'pagination' => CompanyResource::collection($companiesPagination),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Company::class);

        return Inertia::render('Companies/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCompanyRequest $request)
    {
        $this->authorize('create', Company::class);

        $validated = $request->validated();
        $organizationId = session('organization_id');

        $address = Address::create([
            'street_address' => $validated['street_address'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'zip_code' => $validated['zip_code'],
            'organization_id' => $organizationId,
        ]);

        $company = Company::create([
            'name' => $validated['name'],
            'website' => $validated['website'],
            'industry' => $validated['industry'],
            'description' => $validated['description'],
            'address_id' => $address->id,
            'organization_id' => $organizationId,
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new CompanyResource($company);
        }

        return redirect()->route('companies.show', $company->id)->with(['message' => 'Company created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company)
    {
        $this->authorize('view', $company);

        return Inertia::render('Companies/Show', [
            'company' => new CompanyResource($company),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company)
    {
        $this->authorize('update', $company);

        return Inertia::render('Companies/Edit', [
            'company' => new CompanyResource($company),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCompanyRequest $request, Company $company)
    {
        $this->authorize('update', $company);

        $validated = $request->validated();

        $addressFields = array_intersect_key($validated, array_flip(['street_address', 'city', 'state', 'zip_code']));
        $companyFields = array_intersect_key($validated, array_flip(['name', 'website', 'industry', 'description']));

        if (!empty($addressFields)) {
            Address::find($company->address_id)->update($addressFields);
        }

        if (!empty($companyFields)) {
            $company->update($companyFields);
        }

        return redirect()->route('companies.show', $company->id)->with(['message' => 'Company updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $this->authorize('delete', $company);

        $company->delete();

        return redirect()->route('companies.index')->with(['message' => 'Company deleted successfully!', 'type' => 'success']);
    }

    public function getCompaniesOptions(Request $request)
    {
        $organizationId = session('organization_id');

        $query = Company::where('organization_id', $organizationId);

        if ($request->filled('query')) {
            $query->where('name', 'like', '%' . $request->input('query') . '%');
        }

        $companies = $query->orderBy('name')->take(10)->get();

        return CompanyDataResource::collection($companies);
    }
}
