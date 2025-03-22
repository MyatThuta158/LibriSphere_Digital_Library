<?php
namespace App\Http\Controllers;

use App\Models\Resources;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResourcesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resources = Resources::paginate(8);
        return response()->json(['data' => $resources], 200);
    }

    public function getResource()
    {
        $resource = Resources::limit(8)->get();
        return response()->json(['data' => $resource], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();

        $user = Auth::user();

        // Check if the authenticated user is a manager or librarian with permission
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        // Validate incoming data including resourceType.
        $validate = $request->validate([
            'code'         => 'required',
            'name'         => 'required',
            'date'         => 'required',
            'Photo'        => 'required', // Ensuring it's a valid file
            'file'         => 'required', // Ensuring it's a valid file or file path from chunked upload
            'ISBN'         => 'nullable|string',
            'author'       => 'required|exists:authors,id',
            'genre'        => 'required',
            'genre.*'      => 'required',
            'Description'  => 'required',
            'resourceType' => 'required|exists:resource_file_types,id', // new validation for resource type
        ]);

        try {
            if ($request->hasFile('Photo')) {
                // Process cover photo upload
                $photo     = $request->file('Photo');
                $photoPath = $photo->store('resources', 'public');

                if ($photoPath) {
                    $result = Resources::create([
                        'code'            => $validate['code'],
                        'name'            => $validate['name'],
                        'publish_date'    => $validate['date'],
                        'cover_photo'     => $photoPath,
                        'ISBN'            => $validate['ISBN'],
                        'file'            => $validate['file'], // This may be a file path returned from chunk upload
                        'author_id'       => $validate['author'],
                        'Description'     => $validate['Description'],
                        'MemberViewCount' => 0,
                        'resource_typeId' => $validate['resourceType'], // Save the resource type ID
                    ]);

                    // Process genres (many-to-many relationship)
                    $genre    = $validate['genre'];
                    $genreArr = json_decode($genre, true);
                    $result->genre()->attach($genreArr);

                    return response()->json([
                        'status'  => 200,
                        'message' => 'Data inserted successfully',
                    ]);
                } else {
                    return response()->json([
                        'status'  => 400,
                        'message' => 'File path error',
                    ]);
                }
            } else {
                return response()->json([
                    'status'  => 400,
                    'message' => 'File problems',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Data not inserted',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Eager load both the author and Genre relationships
            $resource = Resources::with(['author', 'Genre'])->find($id);

            if ($resource) {
                return response()->json(['data' => $resource], 200);
            } else {
                return response()->json(['message' => 'No data found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error in data fetching!',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        ob_clean();
        $user = Auth::user();

        // Only managers or librarians with proper permission can update the resource.
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can update resources.'], 403);
        }

        // Find the resource by $id
        $resource = Resources::find($id);
        if (! $resource) {
            return response()->json(['error' => 'Resource not found'], 404);
        }

        // Validate inputs: using "sometimes" so that fields not provided remain unchanged.
        $validated = $request->validate([
            'code'         => 'nullable',
            'name'         => 'nullable',
            'date'         => 'nullable',
            'Photo'        => 'nullable', // Optional file upload
            'file'         => 'nullable', // Optional file upload
            'ISBN'         => 'nullable',
            'author'       => 'nullable|exists:authors,id',
            'genre'        => 'nullable', // Expecting a JSON encoded array
            'desc'         => 'nullable',
            'resourceType' => 'nullable|exists:resource_file_types,id', // New rule for update
        ]);

        // Build an array of fields to update.
        $data = [];
        if ($request->has('code')) {
            $data['code'] = $request->input('code');
        }
        if ($request->has('name')) {
            $data['name'] = $request->input('name');
        }
        if ($request->has('date')) {
            $data['publish_date'] = $request->input('date');
        }
        if ($request->has('ISBN')) {
            $data['ISBN'] = $request->input('ISBN');
        }
        if ($request->has('author')) {
            $data['author_id'] = $request->input('author');
        }
        if ($request->has('desc')) {
            $data['Description'] = $request->input('desc');
        }
        if ($request->has('resourceType')) {
            $data['resource_typeId'] = $request->input('resourceType');
        }

        if ($request->has('file')) {
            $data['file'] = $request->input('file');
        }

        // Handle cover photo update.
        if ($request->hasFile('Photo')) {
            // Delete the old cover photo if it exists.
            if ($resource->cover_photo && Storage::disk('public')->exists($resource->cover_photo)) {
                Storage::disk('public')->delete($resource->cover_photo);
            }
            $photo               = $request->file('Photo');
            $photoPath           = $photo->store('userimg', 'public');
            $data['cover_photo'] = $photoPath;
        }

        // Handle resource file update.
        // You can add your file update logic here if needed.

        try {
            // Update only the provided fields.
            $resource->update($data);

            // Handle genre update with manual diff logic.
            if ($request->has('genre')) {
                // Decode the incoming JSON genre array
                $newGenreArr = json_decode($request->input('genre'), true);

                // Get the current genre IDs associated with the resource
                $currentGenreArr = $resource->genre->pluck('id')->toArray();

                // Determine which genres to remove and which to add
                $genresToDetach = array_diff($currentGenreArr, $newGenreArr);
                $genresToAttach = array_diff($newGenreArr, $currentGenreArr);

                // Remove genres that are no longer present
                if (! empty($genresToDetach)) {
                    $resource->genre()->detach($genresToDetach);
                }

                // Add any new genres that were not previously associated
                if (! empty($genresToAttach)) {
                    $resource->genre()->attach($genresToAttach);
                }
            }

            return response()->json([
                'status'  => 200,
                'message' => 'Resource updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Error updating resource',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resources $resources)
    {
        $user = Auth::user();

        // Check if the authenticated user is a manager or librarian.
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        // Delete logic for resource (if needed) would be added here.
    }

    public function search(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string',
        ]);

        $name      = $request->input('name');
        $resources = Resources::when($name, function ($query, $name) {
            return $query->where('name', 'LIKE', "%{$name}%");
        })->paginate(8);

        return response()->json(['data' => $resources], 200);
    }
}
