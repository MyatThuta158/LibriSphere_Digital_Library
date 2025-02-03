<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{

  
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        //----This check if the user is authenticate---//
        $user = Auth::user();
  
         // Check if the authenticated user is a 'manager'
         if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage resources')) {
             return response()->json(['error' => 'Only librarian and manager can view libraian lists!'], 403);
         }
         
        //----Get admins with pagination---//
        $data=Admin::paginate(5);
        return response()->json(['data' => $data],200); //-----Return the data to fontend--//
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();
       // dd("Hello");
    //    $user = Auth::user();
    //   // dd($user->hasRole('manager'));

    //    // Check if the authenticated user is a 'manager'
    //    if (!$user || !$user->hasRole('manager')||!$user->can('manage users')) {
    //        return response()->json(['error' => 'Only managers can register new admins.'], 403);
    //    }
       

        //----This validate the request input---//
        try {
            $validate = $request->validate([
                'Name' => 'string|required',
                'Email' => 'required|email|string|unique:admins,Email|max:255',
                'Password' => 'required|string|min:8',
                'Role' => 'required|string|in:manager,librarian',
                'phone_number' => 'required|string',
                'Gender' => 'required|string|in:male,female,other',
                'PicImg' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors()
            ], 422); 
        }

      
    
        try {
            // Handle file upload
            $photoPath = null;
            if ($request->hasFile('PicImg')) {
                $photo = $request->file('PicImg');
                $photoPath = $photo->store('admins', 'public');
            }
    
            // Insert data into the database
            $result = Admin::create([
                'Name' => $validate['Name'],
                'Email' => $validate['Email'],
                'Password' => Hash::make($validate['Password']),
                'PhoneNumber' => $validate['phone_number'],
                'Gender' => $validate['Gender'],
                'ProfilePicture' => $photoPath,
                'Role' => $validate['Role'],
            ]);
            
    
            if ($result) {

                $role=Role::where('name',$validate['Role'])->first();

                if ($role) {
                    $result->assignRole($role);
                }
                else {
                    // If role does not exist, throw an error
                    return response()->json([
                        'message' => 'The specified role does not exist!',
                        'status' => 400,
                    ], 400);
                }

                return response()->json(['message' => 'User registered successfully!','status'=>200],200);
            } else {
                return response()->json(['message' => 'User registration failed!'], 500);
            }
        } catch (\Exception $e) {
            Log::error('Error occurred while registering user: ' . $e->getMessage()); //----This log the error when encounter---//
            return response()->json(['error' => 'Something went wrong. Please try again later!'], 500);
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Admin $admin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

       $admin=Admin::find($id); //---This is to find admin resource--//

       if ($admin) {
        try{

            $admin->delete(); //////--This for delete process----//////

            return response()->json(["message"=>"Admin Delete Successfully!","status"=>200]); /////-----This is the return message for admin delete successful--////

        }catch(\Exception $e){
            return response()->json(["message"=>$e,"status"=>500]);
        }
       }else{
        return response()->json(["message"=>"Admin not found!","status"=>500]); //////----This is the return message for admin not foun---//
       }

    }
}
