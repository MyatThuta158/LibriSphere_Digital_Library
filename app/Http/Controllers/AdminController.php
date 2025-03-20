<?php
namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //----This check if the user is authenticated---//
        $user = Auth::user();

        // Check if the authenticated user is a 'manager' or 'librarian' with the required permission
        if (! $user || ! $user->hasRole(['manager', 'librarian']) || ! $user->can('manage resources')) {
            return response()->json(['error' => 'Only librarian and manager can view librarian lists!'], 403);
        }

        try {
            // Fetch admins grouped by 'manager' role with default pagination of 5 records per page
            $managers = Admin::whereHas('roles', function ($query) {
                $query->where('name', 'manager');
            })->paginate(5); // Always 5 records per page
                             //$managers = Admin::where('role', 'manager');

            // Fetch admins grouped by 'librarian' role with default pagination of 5 records per page
            $librarians = Admin::whereHas('roles', function ($query) {
                $query->where('name', 'librarian');
            })->paginate(5); // Always 5 records per page

            // Return paginated admins grouped by roles
            return response()->json([
                'status'  => 200,
                'data'    => [
                    'managers'   => $managers,
                    'librarians' => $librarians,
                ],
                'message' => 'Admins grouped by role with pagination fetched successfully!',
            ], 200);
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json([
                'status' => 500,
                'error'  => 'An error occurred while fetching the admins: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();
        // Optionally, if you want to restrict this to only managers,
        // uncomment the following lines and adjust as needed.
        // $user = Auth::user();
        // if (!$user || !$user->hasRole('manager') || !$user->can('manage users')) {
        //     return response()->json(['error' => 'Only managers can register new admins.'], 403);
        // }

        // Validate the request input with a custom message for a duplicate email.
        try {
            $validate = $request->validate([
                'Name'         => 'string|required',
                'Email'        => 'required|email|string|unique:admins,Email|max:255',
                'Password'     => 'required|string|min:8',
                'role'         => 'required|string|in:manager,librarian',
                'phone_number' => 'required|string',
                'Gender'       => 'required|string|in:male,female,other',
                'PicImg'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'Email.unique' => 'Email already existed',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            // Handle file upload if provided
            $photoPath = null;
            if ($request->hasFile('PicImg')) {
                $photo     = $request->file('PicImg');
                $photoPath = $photo->store('admins', 'public');
            }

            // Insert data into the database
            $result = Admin::create([
                'Name'           => $validate['Name'],
                'Email'          => $validate['Email'],
                'Password'       => Hash::make($validate['Password']),
                'PhoneNumber'    => $validate['phone_number'],
                'Gender'         => $validate['Gender'],
                'ProfilePicture' => $photoPath,
                'role'           => $validate['role'],
            ]);

            if ($result) {
                // Find and assign the role to the newly created admin
                $role = Role::where('name', $validate['role'])->first();
                if ($role) {
                    $result->assignRole($role);
                } else {
                    return response()->json([
                        'message' => 'The specified role does not exist!',
                        'status'  => 400,
                    ], 400);
                }

                return response()->json(['message' => 'User registered successfully!', 'status' => 200], 200);
            } else {
                return response()->json(['message' => 'User registration failed!'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error occurred while registering user: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong. Please try again later!'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $admin = Auth::user();
        if (! $admin) {
            return response()->json([
                'message' => 'Admin not found!',
                'status'  => 404,
            ], 404);
        }

        return response()->json([
            'data'   => $admin,
            'status' => 200,
        ], 200);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        ob_clean();
        // Retrieve the authenticated admin
        $admin = Auth::user();

        //dd($admin);

        if (! $admin) {
            return response()->json([
                'message' => 'Admin not found!',
                'status'  => 404,
            ], 404);
        }

        // Validate only the fields that are provided using "sometimes"
        $validatedData = $request->validate([
            'Name'        => 'sometimes|string',
            'Email'       => 'sometimes|email|string|max:255|unique:admins,Email,' . $admin->id,
            // 'Password'    => 'sometimes|string|min:8',
            'PhoneNumber' => 'sometimes|string',
            'Gender'      => 'sometimes|string|in:Male,Female',
            'PicImg'      => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            // 'role' is not included so it won't be updated.
        ]);

        // Handle the profile picture if provided
        if ($request->hasFile('PicImg')) {
            // Delete the old profile picture if it exists
            if ($admin->ProfilePicture && \Illuminate\Support\Facades\Storage::disk('public')->exists($admin->ProfilePicture)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($admin->ProfilePicture);
            }
            $photo                 = $request->file('PicImg');
            $photoPath             = $photo->store('admins', 'public');
            $admin->ProfilePicture = $photoPath;
        }

        // Update the fields only if they are present in the request
        if (isset($validatedData['Name'])) {
            $admin->Name = $validatedData['Name'];
        }
        if (isset($validatedData['Email'])) {
            $admin->Email = $validatedData['Email'];
        }
        // if (isset($validatedData['Password'])) {
        //     $admin->Password = Hash::make($validatedData['Password']);
        // }
        if (isset($validatedData['PhoneNumber'])) {
            $admin->PhoneNumber = $validatedData['PhoneNumber'];
        }
        if (isset($validatedData['Gender'])) {
            $admin->Gender = $validatedData['Gender'];
        }

        // Save changes to the database
        $admin->save();

        return response()->json([
            'message' => 'Admin updated successfully!',
            'status'  => 200,
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        // Retrieve the authenticated admin
        $admin = Auth::user();

        if (! $admin) {
            return response()->json([
                'message' => 'Admin not found!',
                'status'  => 404,
            ], 404);
        }

        // Validate the incoming request
        $validatedData = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8|confirmed',
        ]);

        // Check if the current password matches
        if (! Hash::check($validatedData['current_password'], $admin->Password)) {
            return response()->json([
                'message' => 'Current password is incorrect!',
                'status'  => 400,
            ], 400);
        }

        // Check if the new password is the same as the current password
        if (Hash::check($validatedData['new_password'], $admin->Password)) {
            return response()->json([
                'message' => 'New password cannot be the same as the current password!',
                'status'  => 400,
            ], 400);
        }

        // Update the password
        $admin->Password = Hash::make($validatedData['new_password']);
        $admin->save();

        return response()->json([
            'message' => 'Password change successfully!',
            'status'  => 200,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        $admin = Admin::find($id); //---This is to find admin resource--//

        if ($admin) {
            try {

                $admin->delete(); //////--This for delete process----//////

                return response()->json(["message" => "Admin Delete Successfully!", "status" => 200]); /////-----This is the return message for admin delete successful--////

            } catch (\Exception $e) {
                return response()->json(["message" => $e, "status" => 500]);
            }
        } else {
            return response()->json(["message" => "Admin not found!", "status" => 500]); //////----This is the return message for admin not foun---//
        }

    }
}
