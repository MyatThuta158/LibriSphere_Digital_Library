<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Mockery\Expectation;

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
        $validate=$request->validate([
            'name'=>'string|required',
            'email'=>'required|email|string',
            'password'=>'required|string',
            'phone_number'=>'required|string',
            'age'=>'required|string',
            'role'=>'required|string|in:manager,member,owner,librarian,community_member',
        ]);

        //dd($validate['phone_number']);
        //-----This is the process to add data into database---//
        try{

            $result=User::create([
                'name'=>$validate['name'],
                'email'=>$validate['email'],
                'password'=>Hash::make($validate['password']),
                'phone_number'=>$validate['phone_number'],
                'age'=>$validate['age'],
                'role'=>$validate['role']
            ]);

            

            //-----Check the result is save in database or not---//
            if (!$result) {
                return response()->json(['message'=>'User register Unsuccessfully!']);
            }

            return response()->json(['message'=>'User register successfully!']);
        }catch(\Exception $e){
            //------Retruning the error to font end----//
            return response()->json(['error'=>$e]);
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
