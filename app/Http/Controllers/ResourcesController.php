<?php
namespace App\Http\Controllers;

use App\Models\Resources;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            $resource = Resources::find($id); //----This get the resource from database---//

            //dd($resource);
            if ($resource) {
                return response()->json(['message' => $resource]); //-----This is the return message with data----//
            } else {
                return response()->json(['message' => "No data found"]); //----This is the message when data not found--//
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error in data fetching!']);
        }

        // try {
        //     $resource = Resources::find($id); // Fetch the resource from the database.

        //     if ($resource) {
        //         // Encode the resource data as a Base64 JSON string.
        //         $resourceJson = json_encode($resource); // Convert resource to JSON.
        //         $base64Encoded = base64_encode($resourceJson); // Encode JSON to Base64.

        //         // Return the Base64 encoded string in the response.
        //         return response()->json([
        //             'message' => 'Resource found.',
        //             'data' => $base64Encoded,
        //         ]);
        //     } else {
        //         return response()->json([
        //             'message' => 'No data found.',
        //         ]);
        //     }
        // } catch (\Exception $e) {
        //     return response()->json([
        //         'message' => 'Error in data fetching!',
        //         'error' => $e->getMessage(),
        //     ]);
        // }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resources $resources)
    {
        $user = Auth::user();
        // dd($user->hasRole('manager'));

        // Check if the authenticated user is a 'manager'
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
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
