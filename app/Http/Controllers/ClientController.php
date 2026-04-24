<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Address;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Create the controller instance.
     */
    public function __construct()
    {
        $this->authorizeResource(Client::class, 'client');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return view('clients.index', [
            'items' => Client::search($request->input('query') ?? '')->paginate(10),
            'resourceName' => 'clients',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('clients.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        $validated = $request->validated();

        $address = Address::create([
            'street_address' => $validated['street_address'],
            'city' => $validated['city'],
            'state' => $validated['state'],
            'zip_code' => $validated['zip_code'],
        ]);

        Client::create([
            'company' => $validated['company'],
            'vat' => $validated['vat'],
            'address_id' => $address->id,
        ]);

        return redirect('/clients')->with(['message' => 'Client created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return view('clients.show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return view('clients.edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $validated = $request->validated();

        $addressFields = array_intersect_key($validated, array_flip(['street_address', 'city', 'state', 'zip_code']));
        $clientFields = array_intersect_key($validated, array_flip(['company', 'vat']));

        if (! empty($addressFields)) {
            $client->address->update($addressFields);
        }

        if (! empty($clientFields)) {
            $client->update($clientFields);
        }

        return redirect('/clients')->with(['message' => 'Client updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        // Check for constraints before deleting the client
        if ($client->projects()->exists()) {
            return redirect('/clients')->with(['message' => 'Unable to delete the client as there are associated projects.', 'type' => 'failure']);
        }

        $client->address->delete();
        $client->delete();

        return redirect('/clients')->with(['message' => 'Client deleted successfully!', 'type' => 'success']);
    }
}
