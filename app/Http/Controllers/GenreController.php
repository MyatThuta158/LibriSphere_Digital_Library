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
        $user=Auth::user();

        //-----This check if the user can have role and permission to make the below action---///
        if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage genre')) {
            return response()->json(['message'=>"Unauthorize"],403);
        }

        $allData=Genre::all();
        return response()->json(['status'=>200,'data'=>$allData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info('Received data:', $request->all());
        $user = Auth::user();
        Log::info('User:', ['user' => $user]);
    
        // if (!$user || !$user->hasRole(['manager','librarian']) || !$user->can('manage genre')) {
        //     return response()->json(['message' => "Unauthorized"], 403);
        //     Log::info('Authorize', "Authorize");
        // }else{
        //     Log::info('UnAuthorize', "UnAuthorize");
        // }
    
        try {
            // Change validation to use 'name' column but keep 'genre_name' as input field
            $validatedData = $request->validate([
                'genre_name' => 'required|string', // 
            ], [
                'genre_name.required' => 'Name is required'
                
            ]);

            //dd($validatedData);
    
            Log::info('validate data:', $validatedData);
            $result = Genre::create([
                'name' => $validatedData['genre_name'], // 
            ]);

            // dd($result);
            
            return response()->json([
                'status' => 200,
                'message' => 'Data inserted successfully'
            ]);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ]);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
         //------This is to find specific resource----//
       $result=Genre::where('id',$id)->first();

       if(!$result){
        return response()->json(['status'=>200,'message'=>'Data cannot found']);
       }

       return response()->json(['status'=>200,'data'=>$result]); //-----This return result find value----//
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        ///-----This get all data----//
        $user=Auth::user();

       // dd($user);
         //-----This check if the user can have role and permission to make the below action---///
         if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage genre')) {
            return response()->json(['message'=>"Unauthorize"],403);
        }
        try{
            //----This validate for incoming value to not empty---//
            $validatedData = $request->validate([
                'name' => 'required|unique:genres',
            ],['name.required'=>'Name is required','name.unique'=>'Name already exists']);

            // dd($validatedData);
            $result=Genre::where('id',$id)->update($validatedData);
            // dd($result);

            if($result){
                return response()->json([
                    'status'=>200,
                    'message'=>'Data updated successfully'
            ]);
            }

            //----This return if the data does not enter into database----//
            return response()->json([
                'status'=>500,
                'message'=>'Data not updated'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'=>500,
                'message'=>'Data insert error!'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        ///-----This get all data----//
        $user=Auth::user();

        //-----This check if the user can have role and permission to make the below action---///
        if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage genre')) {
            return response()->json(['message'=>"Unauthorize"],403);
        }
         //---This is for delete processes----//
         try{
            $result=Genre::where('id',$id)->delete();

            if (!$result) {
                return response()->json([
                    'status'=>500,
                    'message'=>'Data not deleted'
                ]);
            }

            return response()->json([
                'status'=>200,
                'message'=>'Data deleted successfully'
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status'=>500,
                'message'=>'Data not deleted'
            ]);
        }
    }
    
}
