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
        return response()->json(['message' => 'Its work']);
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
        //
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
    public function updateInfo(Request $request, string $id)
    {
        try {
            // Validate only the fields you want to update
            $validatedData = $request->validate([
                'name'         => 'required|string',
                'email'        => 'required|email|string|unique:users,email,' . $id,
                'phone_number' => 'required|string',
                'DateOfBirth'  => 'required|string',
                'gender'       => 'required|string|in:male,female',

            ]);

            // Find user by ID
            $user = User::findOrFail($id);

            //dd($request->all());

            // Update only the allowed fields
            $result = $user->update($validatedData);

            if (! $result) {
                return response()->json([
                    'message' => 'Fail to update user data!',
                    'status'  => 500,

                ], 500);
            }

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

    //----------This is to update profile picture-----------//
    public function updateProfilePicture(Request $request, $id)
    {
        ob_clean();
        // Find the user by the provided ID or return a 404 error.
        $user = User::findOrFail($id);

        // Validate the incoming image file.
        $request->validate([
            'ProfilePic' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // If an existing profile picture exists, remove it.
        if ($user->ProfilePic && Storage::disk('public')->exists($user->ProfilePic)) {
            Storage::disk('public')->delete($user->ProfilePic);
        }

        // Handle file upload: store the new profile picture in the 'users' directory.
        $photo     = $request->file('ProfilePic');
        $photoPath = $photo->store('users', 'public'); // Stored under storage/app/public/users

        // Update only the ProfilePic field for the user.
        $user->update(['ProfilePic' => $photoPath]);

        // Return a success response with the URL to the updated profile picture.
        return response()->json([
            'message'    => 'Profile picture updated successfully!',
            'ProfilePic' => $photoPath,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // -----------This is for member report----------//

}
