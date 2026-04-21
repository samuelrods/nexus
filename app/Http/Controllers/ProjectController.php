<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Project::class);

        return view('projects.index', [
            'items' => Project::search($request->input('query') ?? '')->paginate(10),
            'resourceName' => 'projects',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('projects.create', [
            'users' => User::orderBy('name')->select('name', 'id')->get(),
            'clients' => Client::orderBy('company')->select('company', 'id')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $this->authorize('create', Project::class);

        $project = Project::create($request->validated());

        return redirect()->route('projects.show', $project)->with(['message' => 'Project created successfully!', 'type' => 'success']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return view('projects.show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return view('projects.edit', [
            'project' => $project,
            'users' => User::orderBy('name')->select('name', 'id')->get(),
            'clients' => Client::orderBy('company')->select('company', 'id')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('projects.show', $project)->with(['message' => 'Project updated successfully!', 'type' => 'success']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with(['message' => 'Project deleted successfully!', 'type' => 'success']);
    }
}
