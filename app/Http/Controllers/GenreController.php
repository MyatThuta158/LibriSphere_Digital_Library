<?php
namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GenreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        ///-----This get all data----//
        $user = Auth::user();

        //dd($user->hasRole(['manager','librarian']));

        //-----This check if the user can have role and permission to make the below action---///
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage genre')) {
            return response()->json(['message' => "Unauthorize"], 401);
        }

        $allData = Genre::all();
        return response()->json(['status' => 200, 'data' => $allData]);
    }

    // public function getGenre()
    // {
    //     // Fetch only 3 records from the Genre table
    //     $allData = Genre::limit(5)->get();
    //     // or: Genre::take(3)->get();

    //     return response()->json(['status' => 200, 'data' => $allData]);
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log::info('Received data:', $request->all());
        $user = Auth::user();
        // Log::info('User:', ['user' => $user]);

        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage genre')) {
            return response()->json(['message' => "Unauthorized"], 403);
            // Log::info('Authorize', "Authorize");
        }

        try {
            $validatedData = $request->validate([
                'genre_name' => 'required|string',
            ], [
                'genre_name.required' => 'Name is required',
            ]);

            // Check if the genre already exists in the database
            $exists = Genre::where('name', $validatedData['genre_name'])->exists();
            if ($exists) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'The genre name is already existed in the system',
                ]);
            }

            Log::info('validate data:', $validatedData);
            $result = Genre::create([
                'name' => $validatedData['genre_name'],
            ]);

            return response()->json([
                'status'  => 200,
                'message' => 'The genre information insert successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //------This is to find specific resource----//
        $result = Genre::where('id', $id)->first();

        if (! $result) {
            return response()->json(['status' => 200, 'message' => 'Data cannot found']);
        }

        return response()->json(['status' => 200, 'data' => $result]); //-----This return result find value----//
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        // Check if the authenticated user is a 'manager' or 'librarian' with permission to manage genres
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage genre')) {
            return response()->json(['error' => 'Only managers or librarians can update genres.'], 403);
        }

        try {
            // Validate that the name field is provided
            $validatedData = $request->validate([
                'name' => 'required',
            ]);

            // Check if a genre with the same name already exists, excluding the current record.
            $exists = Genre::where('name', $validatedData['name'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Genre name already exists',
                ]);
            }

            // Update the genre data
            $result = Genre::where('id', $id)->update($validatedData);

            if ($result) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Genre updated successfully',
                ]);
            }

            // Return error if data is not updated
            return response()->json([
                'status'  => 500,
                'message' => 'Data not updated',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Data insert error!',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        ///-----This get all data----//
        $user = Auth::user();

        //-----This check if the user can have role and permission to make the below action---///
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage genre')) {
            return response()->json(['message' => "Unauthorize"], 403);
        }
        //---This is for delete processes----//
        try {
            $result = Genre::where('id', $id)->delete();

            if (! $result) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Data not deleted',
                ]);
            }

            return response()->json([
                'status'  => 200,
                'message' => 'Data deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Data not deleted',
            ]);
        }
    }

}
