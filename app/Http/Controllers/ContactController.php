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
    public function index(Request $request)
    {
        $this->authorize('viewAny', Contact::class);

        $organizationId = session('organization_id');

        $stats = [
            'total_contacts' => Contact::where('organization_id', $organizationId)->count(),
            'new_this_month' => 0, // No created_at column in contacts table
            'key_accounts' => Contact::where('organization_id', $organizationId)
                ->has('deals')
                ->count(),
        ];

        if ($request->filled('query')) {
            $searchResults = Contact::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Contacts/Index', [
                'pagination' => ContactResource::collection($searchResults),
                'stats' => $stats,
            ]);
        }

        $contactsPagination = Contact::where('organization_id', $organizationId)
            ->orderBy('first_name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Contacts/Index', [
            'pagination' => ContactResource::collection($contactsPagination),
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Contact::class);

        return Inertia::render('Contacts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $this->authorize('create', Contact::class);

        $contact = Contact::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
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
    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        return Inertia::render('Contacts/Show', [
            'contact' => new ContactResource($contact),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        $this->authorize('update', $contact);

        return Inertia::render('Contacts/Edit', [
            'contact' => new ContactResource($contact),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->update($request->validated());

        return redirect()->route('contacts.show', $contact->id)->with(['message' => 'Contact updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $this->authorize('delete', $contact);

        // check if contact has leads
        if ($contact->leads()->exists()) {
            return back()->with(['message' => 'Contact has leads and cannot be deleted.', 'type' => 'failure']);
        }

        $contact->delete();

        return redirect()->route('contacts.index')->with(['message' => 'Contact deleted successfully!', 'type' => 'success']);
    }

    public function getContactsOptions(Request $request)
    {
        $organizationId = session('organization_id');

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
