<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Mockery\Expectation;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['message'=>'Its work']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();
        //----This validates the request input---//
        try {
            $validate = $request->validate([
                'name' => 'string|required',
                'email' => 'required|email|string|unique:users,email|max:255', // Ensure email is unique
                'password' => 'required|string|min:8',
                'phone_number' => 'required|string',
                'DateOfBirth' => 'required|string',
                'gender' => 'required|string|in:male,female',
                'role' => 'required|string|in:member,community_member',
                'ProfilePic' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Optional image file
            ]);
        } catch (ValidationException $e) {
            // Log the validation errors
            Log::error('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all() // Optional: Log the input data for debugging purposes
            ]);
        
            // Return the response with validation errors
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors()
            ], 422);
        }
    
        try {
            // Handle file upload
            $photoPath = null;
            if ($request->hasFile('ProfilePic')) {
                $photo = $request->file('ProfilePic');
                $photoPath = $photo->store('users', 'public'); // Store image in 'users' folder
            }
    

          //  dd($validate);
            // Insert data into the database
            $result = User::create([
                'name' => $validate['name'],
                'email' => $validate['email'],
                'password' => Hash::make($validate['password']),
                'gender'=>$validate['gender'],
                'phone_number' => $validate['phone_number'],
                'DateOfBirth' => $validate['DateOfBirth'],
                'role' => $validate['role'],
                'ProfilePic' => $photoPath, // Store the image path
            ]);

          
    
            //-----Check if the result is saved in the database or not---//
            if (!$result) {
                return response()->json(['message' => 'User registration failed!','status'=>500], 500);
            }
    
            // You can also assign the role to the user if needed:
            $role = Role::where('name', $validate['role'])->first();
    
            if ($role) {
                $result->assignRole($role); // Assign role to the user
            } else {
                return response()->json([
                    'message' => 'The specified role does not exist!',
                    'status' => 400,
                ], 400);
            }
    
            return response()->json(['message' => 'User registered successfully!', 'status' => 200,'id'=>$result->id], 200);
        } catch (\Exception $e) {
            Log::error('Error occurred while registering user: ' . $e->getMessage()); // Log the error
            return response()->json(['error' => 'Something went wrong. Please try again later!'], 500);
        }
    }
    

    // Login for user//
    public function login(Request $request)
    {
      //-----This is for input validation---//
        $validate=$request->validate([
            'email'=>'required|email|string',
            'password'=>'required|string',
        ]);

        //---This is for login process---//
        try{
            if (!Auth::attempt($validate)) {
                return response()->json(['message'=>'Invalid login credentials'],\Symfony\Component\HttpFoundation\Response::HTTP_UNAUTHORIZED);
            }

            $user=Auth::user();
            $token=$user->createToken('token')->plainTextToken;
            //dd($token);
            if ($token != null) {
                //-----This set the token period as 1 day----//
                $cookie = cookie('token', $token, 60*24); // 1 day
                return response()->json(['message'=>'Login successfully!','user'=>$user,'cookies'=>$token])->withCookie($cookie);
            }
            return response()->json(['message'=>'Login unsuccessfully!']);
        }catch(\Exception $e){
            return response()->json(['error'=>$e]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
