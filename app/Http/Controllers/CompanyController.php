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

        if ($request->filled('query')) {
            $searchResults = Company::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Companies', [
                'pagination' => CompanyResource::collection($searchResults),
            ]);
        }

        $companiesPagination = Company::where('organization_id', $organizationId)
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Companies', [
            'pagination' => CompanyResource::collection($companiesPagination),
        ]);
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

        Company::create([
            'name' => $validated['name'],
            'website' => $validated['website'],
            'industry' => $validated['industry'],
            'description' => $validated['description'],
            'address_id' => $address->id,
            'organization_id' => $organizationId,
        ]);

        return back()->with(['message' => 'Company created successfully!', 'type' => 'success']);
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

        return back()->with(['message' => 'Company updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company)
    {
        $this->authorize('delete', $company);

        $company->delete();

        return back()->with(['message' => 'Company deleted successfully!', 'type' => 'success']);
    }

    public function getCompaniesOptions(Request $request)
    {
        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $companies = Company::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->take(10)
                ->get();

            return CompanyDataResource::collection($companies);
        }

        $companies = Company::where('organization_id', $organizationId)
            ->orderBy('name')
            ->orderBy('id')
            ->take(10)
            ->get();

        return CompanyDataResource::collection($companies);
    }
}
