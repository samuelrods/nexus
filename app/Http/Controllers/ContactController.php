<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactDataResource;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, \App\Models\Organization $organization)
    {
        $this->authorize('viewAny', Contact::class);

        $organizationId = $organization->id;

        $stats = [
            'total_contacts' => Contact::where('organization_id', $organizationId)->count(),
            'new_this_month' => Contact::where('organization_id', $organizationId)
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'key_accounts' => Contact::where('organization_id', $organizationId)
                ->has('deals')
                ->count(),
        ];

        $sortBy = $request->input('sort_by', 'id');
        $sortDir = $request->input('sort_dir', 'desc');

        $sortQuery = $sortBy;
        if ($sortBy === 'full_name') {
            $sortQuery = "first_name"; // or use raw concat if needed for sorting by full name
        }

        if ($request->filled('query')) {
            $searchResults = Contact::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->query(function ($q) use ($sortQuery, $sortDir) {
                    $q->orderBy($sortQuery, $sortDir);
                })
                ->paginate(10)->withQueryString();

            return Inertia::render('Contacts/Index', [
                'pagination' => ContactResource::collection($searchResults),
                'stats' => $stats,
                'filters' => $request->only(['query', 'sort_by', 'sort_dir']),
            ]);
        }

        $contactsPagination = Contact::where('organization_id', $organizationId)
            ->orderBy($sortQuery, $sortDir)
            ->paginate(10)->withQueryString();

        return Inertia::render('Contacts/Index', [
            'pagination' => ContactResource::collection($contactsPagination),
            'stats' => $stats,
            'filters' => $request->only(['query', 'sort_by', 'sort_dir']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(\App\Models\Organization $organization)
    {
        $this->authorize('create', Contact::class);

        return Inertia::render('Contacts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request, \App\Models\Organization $organization)
    {
        $this->authorize('create', Contact::class);

        $contact = Contact::create([
            ...$request->validated(),
            'organization_id' => $organization->id,
            'user_id' => auth()->id(),
        ]);

        if (($request->wantsJson() || $request->ajax()) && !$request->header('X-Inertia')) {
            return new ContactResource($contact);
        }

        return redirect()->route('contacts.show', $contact->id)->with(['message' => 'Contact created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(\App\Models\Organization $organization, Contact $contact)
    {
        $this->authorize('view', $contact);

        return Inertia::render('Contacts/Show', [
            'contact' => new ContactResource($contact),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(\App\Models\Organization $organization, Contact $contact)
    {
        $this->authorize('update', $contact);

        return Inertia::render('Contacts/Edit', [
            'contact' => new ContactResource($contact),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, \App\Models\Organization $organization, Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->update($request->validated());

        return redirect()->route('contacts.show', $contact->id)->with(['message' => 'Contact updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(\App\Models\Organization $organization, Contact $contact)
    {
        $this->authorize('delete', $contact);

        // check if contact has leads
        if ($contact->leads()->exists()) {
            return back()->with(['message' => 'Contact has leads and cannot be deleted.', 'type' => 'failure']);
        }

        $contact->delete();

        return redirect()->route('contacts.index')->with(['message' => 'Contact deleted successfully!', 'type' => 'success']);
    }

    public function getContactsOptions(Request $request, \App\Models\Organization $organization)
    {
        $organizationId = $organization->id;

        $query = Contact::where('organization_id', $organizationId);

        if ($request->filled('query')) {
            $searchTerm = '%' . $request->input('query') . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('first_name', 'like', $searchTerm)
                    ->orWhere('last_name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm);
            });
        }

        $contacts = $query->orderBy('first_name')->take(10)->get();

        return ContactDataResource::collection($contacts);
    }
}
