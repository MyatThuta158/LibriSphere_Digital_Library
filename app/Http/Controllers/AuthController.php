<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
   public function login(Request $request){
    
    try{
        $validate=$request->validate([
            'email'=>'required|email|string',
            'password'=>'required|string',
        ]);
    
    }catch(ValidationException $e){
        return response()->json(['message'=>$e]);
    }
    //---This is for login process---//
    try{
        $email = $validate['email'];
        $password = $validate['password'];

        //-----This check the admin table first----//
        $admin=\App\Models\Admin::where('Email',$email)->first();

        //dd($admin && Hash::check($password, $admin->Password));

        if ($admin && Hash::check($password,$admin->Password)) {
            $token = $admin->createToken('token')->plainTextToken;

            //dd($token);
            $cookie = cookie('token', $token, 60 * 24); // 1 day
           // dd($cookie);
            return response()
                ->json(['message' => 'Admin login successful!', 'user' => $admin, 'token' => $token,'role'=>'admin'])
                ->withCookie($cookie);
        }

        $user = \App\Models\User::where('email', $email)->first();

       // dd($user);
        if ($user && Hash::check($password, $user->password)) {
            // Generate token for user
            $token = $user->createToken('user_token')->plainTextToken;
            $cookie = cookie('token', $token, 60 * 24); // 1 day
            return response()
                ->json(['message' => 'User login successful!', 'user' => $user, 'token' => $token,'role'=>'member'])
                ->withCookie($cookie);
        }


            return response()->json(['message' => 'Invalid login credentials'], \Symfony\Component\HttpFoundation\Response::HTTP_UNAUTHORIZED);
  
    }catch(\Exception $e){
        return response()->json(['error'=>$e->getMessage()],500);
    }
   }
}
