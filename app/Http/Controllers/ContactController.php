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

        if ($request->filled('query')) {
            $searchResults = Contact::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->paginate(10);

            return Inertia::render('Contacts', [
                'pagination' => ContactResource::collection($searchResults),
            ]);
        }

        $contactsPagination = Contact::where('organization_id', $organizationId)
            ->orderBy('first_name')
            ->orderBy('id')
            ->paginate(10);

        return Inertia::render('Contacts', [
            'pagination' => ContactResource::collection($contactsPagination),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        $this->authorize('create', Contact::class);

        Contact::create([
            ...$request->validated(),
            'organization_id' => session('organization_id'),
            'user_id' => auth()->id(),
        ]);

        return back()->with(['message' => 'Contact created successfully!', 'type' => 'success']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $contact->update($request->validated());

        return back()->with(['message' => 'Contact updated successfully!', 'type' => 'success']);
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

        return back()->with(['message' => 'Contact deleted successfully!', 'type' => 'success']);
    }

    public function getContactsOptions(Request $request)
    {
        $organizationId = session('organization_id');

        if ($request->filled('query')) {
            $contacts = Contact::search($request->input('query'))
                ->where('organization_id', $organizationId)
                ->take(10)
                ->get();

            return ContactDataResource::collection($contacts);
        }

        $contacts = Contact::where('organization_id', $organizationId)
            ->orderBy('first_name')
            ->orderBy('id')
            ->take(10)
            ->get();

        return ContactDataResource::collection($contacts);
    }
}
