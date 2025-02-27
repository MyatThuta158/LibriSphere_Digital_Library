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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        ob_clean();

        $user = Auth::user();
        // dd($user->hasRole('manager'));

        // Check if the authenticated user is a 'manager'
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        //----This is validate the resource store---//
        $validate = $request->validate([
            'code'        => 'required',
            'name'        => 'required',
            'date'        => 'required',
            'Photo'       => 'required', // Ensuring it's a valid file
            'file'        => 'required', // Ensuring it's a valid file
            'ISBN'        => 'nullable|string',
            'author'      => 'required|exists:authors,id',
            'genre'       => 'required',
            'genre.*'     => 'required',
            'Description' => 'required',
        ]);

        //----This is for store the resource---//
        try {
            if ($request->hasFile('Photo') && $request->hasFile('file')) {
                /////----This is for file storage processes---//
                $photo     = $request->file('Photo');
                $photoPath = $photo->store('userimg', 'public');

                $test = $request->hasFile('Photo');

                $file     = $request->file('file');
                $filePath = $file->store('resources', 'public');

                if ($photoPath && $filePath) {

                    $result = Resources::create([
                        'code'            => $validate['code'],
                        'name'            => $validate['name'],
                        'publish_date'    => $validate['date'],
                        'cover_photo'     => $photoPath,
                        'ISBN'            => $validate['ISBN'],
                        'file'            => $filePath,
                        'author_id'       => $validate['author'],
                        'Description'     => $validate['Description'],
                        'MemberViewCount' => 0,
                    ]);

                    $genre    = $validate['genre'];
                    $genreArr = json_decode($genre, true);

                    // Attach genres (many-to-many relation)
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
                'error'   => $e,

            ]);
        }
    }

    /**
     * Display the specified resource.
     */

    public function show($id)
    {
        try {
            // Retrieve the resource along with its author using eager loading
            $resource = Resources::with('author')->find($id);

            if ($resource) {
                return response()->json(['data' => $resource], 200);
            } else {
                return response()->json(['message' => 'No data found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in data fetching!', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
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
            'code'        => 'sometimes|required',
            'name'        => 'sometimes|required',
            'date'        => 'sometimes|required|date',
            'Photo'       => 'sometimes|file', // Optional file upload
            'file'        => 'sometimes|file', // Optional file upload
            'ISBN'        => 'nullable|string',
            'author'      => 'sometimes|required|exists:authors,id',
            'genre'       => 'sometimes|required', // Expecting a JSON encoded array
            'Description' => 'sometimes|required',
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
        if ($request->has('Description')) {
            $data['Description'] = $request->input('Description');
        }

        // Handle cover photo update.
        if ($request->hasFile('Photo')) {
            // Delete the old cover photo if it exists.
            if ($resource->cover_photo && \Storage::disk('public')->exists($resource->cover_photo)) {
                \Storage::disk('public')->delete($resource->cover_photo);
            }
            $photo               = $request->file('Photo');
            $photoPath           = $photo->store('userimg', 'public');
            $data['cover_photo'] = $photoPath;
        }

        // Handle resource file update.
        if ($request->hasFile('file')) {
            // Delete the old resource file if it exists.
            if ($resource->file && \Storage::disk('public')->exists($resource->file)) {
                \Storage::disk('public')->delete($resource->file);
            }
            $file         = $request->file('file');
            $filePath     = $file->store('resources', 'public');
            $data['file'] = $filePath;
        }

        try {
            // Update only the provided fields.
            $resource->update($data);

            // If genres are provided, update the many-to-many relationship.
            if ($request->has('genre')) {
                $genreArr = json_decode($request->input('genre'), true);
                $resource->genre()->sync($genreArr);
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
        // dd($user->hasRole('manager'));

        // Check if the authenticated user is a 'manager'
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }
    }

    public function search(Request $request)
    {

        // dd("Hello World");
        // Validate the request input
        $request->validate([
            'name' => 'nullable|string',
        ]);

        // Get the search keyword from the request
        $name = $request->input('name');
        // dd($name);
        // Query resources by name (case-insensitive)
        $resources = Resources::when($name, function ($query, $name) {
            return $query->where('name', 'LIKE', "%{$name}%");
        })->paginate(8); // You can adjust the pagination as needed

        return response()->json(['data' => $resources], 200);
    }

}
