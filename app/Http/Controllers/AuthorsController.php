<?php
namespace App\Http\Controllers;

use App\Models\Authors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $allData = Authors::all();
        return response()->json(['status' => 200, 'data' => $allData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if the authenticated user is a 'manager' or 'librarian' with the correct permission.
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage authors')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        // Check if the author name already exists in the database.
        if (Authors::where('name', $request->name)->exists()) {
            return response()->json([
                'status'  => 400,
                'message' => 'The author name is already existed and please enter different name.',
            ]);
        }

        try {
            // Validate that the name field is provided.
            $validatedData = $request->validate([
                'name' => 'required',
            ], [
                'name.required' => 'Name is required',
            ]);

            // Attempt to create a new author record.
            $result = Authors::create($validatedData);

            if ($result) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Author name saved successfully',
                ]);
            }

            // Return error if record creation fails.
            return response()->json([
                'status'  => 500,
                'message' => 'Author name cannot be saved!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Author name cannot be saved!',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //------This is to find specific resource----//
        $result = Authors::where('id', $id)->first();

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
        // Check if the authenticated user is a 'manager' or 'librarian' with permission to manage authors
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage authors')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        try {
            // Validate that the name field is provided
            $validatedData = $request->validate([
                'name' => 'required',
            ]);

            // Check if an author with the same name already exists, excluding the current record.
            // This ensures that if the current name remains unchanged, the update is allowed.
            $exists = Authors::where('name', $validatedData['name'])
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Author name already exists',
                ]);
            }

            // Update the author data
            $result = Authors::where('id', $id)->update($validatedData);

            if ($result) {
                return response()->json([
                    'status'  => 200,
                    'message' => 'Author name updated successfully',
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
        $user = Auth::user();
        // dd($user->hasRole('manager'));

        // Check if the authenticated user is a 'manager'
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage authors')) {
            return response()->json(['error' => 'Only managers can register new admins.'], 403);
        }

        //---This is for delete processes----//
        try {
            $result = Authors::where('id', $id)->delete();

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
