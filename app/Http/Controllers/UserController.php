<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all users without pagination
        $users = User::all();

        // Return the users in a JSON response
        return response()->json([
            'message' => 'Users retrieved successfully!',
            'status'  => 200,
            'users'   => $users,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            // Add custom error messages for validation rules.
            $validate = $request->validate([
                'name'         => 'required|string',
                'email'        => 'required|email|string|unique:users,email|max:255',
                'password'     => 'required|string|min:8',
                'phone_number' => 'required|string',
                'DateOfBirth'  => 'required|string',
                'gender'       => 'required|string|in:male,female',
                'role'         => 'required|string|in:member,community_member',
            ], [
                'email.unique' => 'Email already exists.',
            ]);
        } catch (ValidationException $e) {
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'input'  => $request->all(),
            ]);

            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            // Insert user data into the database
            $user = User::create([
                'name'         => $validate['name'],
                'email'        => $validate['email'],
                'password'     => Hash::make($validate['password']),
                'gender'       => $validate['gender'],
                'phone_number' => $validate['phone_number'],
                'DateOfBirth'  => $validate['DateOfBirth'],
                'role'         => $validate['role'],
            ]);

            if (! $user) {
                return response()->json([
                    'message' => 'User registration failed!',
                    'status'  => 500,
                ], 500);
            }

            // Assign role to user
            $role = Role::where('name', $validate['role'])->first();
            if ($role) {
                $user->assignRole($role);
            } else {
                return response()->json([
                    'message' => 'The specified role does not exist!',
                    'status'  => 400,
                ], 400);
            }

            // Generate Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully!',
                'status'  => 200,
                'id'      => $user->id,
                'token'   => $token,
                'user'    => $user,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error occurred while registering user: ' . $e->getMessage());
            return response()->json([
                'error' => 'Something went wrong. Please try again later!',
            ], 500);
        }
    }

    // Login for user//
    public function login(Request $request)
    {
        //-----This is for input validation---//
        $validate = $request->validate([
            'email'    => 'required|email|string',
            'password' => 'required|string',
        ]);

        //---This is for login process---//
        try {
            if (! Auth::attempt($validate)) {
                return response()->json(['message' => 'Invalid login credentials'], \Symfony\Component\HttpFoundation\Response::HTTP_UNAUTHORIZED);
            }

            $user  = Auth::user();
            $token = $user->createToken('token')->plainTextToken;
            //dd($token);
            if ($token != null) {
                                                            //-----This set the token period as 1 day----//
                $cookie = cookie('token', $token, 60 * 24); // 1 day
                return response()->json(['message' => 'Login successfully!', 'user' => $user, 'cookies' => $token])->withCookie($cookie);
            }
            return response()->json(['message' => 'Login unsuccessfully!']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            // Retrieve the user along with related information
            $user = User::findOrFail($id);

            return response()->json([
                'message' => 'User retrieved successfully!',
                'status'  => 200,
                'user'    => $user,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error'  => 'User not found!',
                'status' => 404,
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error retrieving user: ' . $e->getMessage());
            return response()->json([
                'error'  => 'An error occurred while retrieving the user.',
                'status' => 500,
            ], 500);
        }
    }

    public function updateRole(Request $request)
    {
        try {
            $validate = $request->validate([
                'role'   => 'required|string|in:member,community_member',
                'userId' => 'required|exists:users,id',
            ]);

            $user = User::findOrFail($validate['userId']);

            // Update role in the database
            $user->update(['role' => $validate['role']]);
            $user->syncRoles($validate['role']);

            return response()->json([
                'message' => 'User role updated successfully!',
                'status'  => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error'  => 'Error occurred while updating the role: ' . $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateUser(Request $request, string $id)
    {
        ob_clean();
        try {
            // Build validation rules for the profile information
            $rules = [
                'name'         => 'required|string',
                'email'        => 'required|email|string|unique:users,email,' . $id,
                'phone_number' => 'required|string',
                'DateOfBirth'  => 'required|string',
            ];

            // If a profile picture is included, add the file validation rule
            if ($request->hasFile('ProfilePic')) {
                $rules['ProfilePic'] = 'required|image|mimes:jpeg,png,jpg,gif|max:2048';
            }

            // Validate the request data according to the rules above
            $validatedData = $request->validate($rules);

            // Find the user by ID
            $user = User::findOrFail($id);

            // If a new profile picture is included, process the file upload
            if ($request->hasFile('ProfilePic')) {
                // If an existing profile picture exists, delete it from storage
                if ($user->ProfilePic && Storage::disk('public')->exists($user->ProfilePic)) {
                    Storage::disk('public')->delete($user->ProfilePic);
                }
                // Get the uploaded file and store it in the 'users' directory
                $photo     = $request->file('ProfilePic');
                $photoPath = $photo->store('users', 'public');
                // Add or replace the ProfilePic field with the new file path in the validated data
                $validatedData['ProfilePic'] = $photoPath;
            }

            // Update the user with the validated (and possibly extended) data
            $result = $user->update($validatedData);

            if (! $result) {
                return response()->json([
                    'message' => 'Fail to update user data!',
                    'status'  => 500,
                ], 500);
            }

            // Refresh the user instance to ensure we have the latest data
            $user->refresh();

            return response()->json([
                'message' => 'User updated successfully!',
                'status'  => 200,
                'user'    => $user,
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error'  => 'Error occurred while updating user: ' . $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        // Retrieve the authenticated user
        $user = Auth::user();

        // dd($user);

        if (! $user) {
            return response()->json([
                'message' => 'User not found!',
                'status'  => 404,
            ], 404);
        }

        // Validate the request. The "confirmed" rule requires that the request includes
        // a matching "new_password_confirmation" field.
        $validatedData = $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:8',
        ]);

        //dd($validatedData);
        // Check if the current password matches the stored hash
        if (! Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect!',
                'status'  => 400,
            ], 400);
        }

        // Check if the new password is the same as the current password
        if (Hash::check($validatedData['new_password'], $user->password)) {
            return response()->json([
                'message' => 'Your current and new password are the same password.Please type another new password!',
                'status'  => 400,
            ], 400);
        }

        // Update the user's password with the new hashed password.
        $user->password = Hash::make($validatedData['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Password changed successfully!',
            'status'  => 200,
        ], 200);
    }

    public function changeUserPassword(Request $request, string $id)
    {
        // Validate the new password from the request
        $request->validate([
            'new_password' => 'required|string|min:8',
        ]);

        try {
            // Find the user by ID; if not found, an exception is thrown
            $user = User::findOrFail($id);

            // Update the user's password with the new hashed password
            $user->password = Hash::make($request->input('new_password'));
            $user->save();

            return response()->json([
                'message' => 'User password updated successfully!',
                'status'  => 200,
                'user'    => $user,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found!',
                'status'  => 404,
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error updating password: ' . $e->getMessage());
            return response()->json([
                'message' => 'Something went wrong. Please try again later!',
                'status'  => 500,
            ], 500);
        }
    }

}
