<?php

namespace App\Http\Controllers;

use App\Models\Authors;
use Dotenv\Exception\ValidationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuthorsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    
         
        $allData=Authors::all();
        return response()->json(['status'=>200,'data'=>$allData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        // $user = Auth::user();
        // // dd($user->hasRole('manager'));
  
        //  // Check if the authenticated user is a 'manager'
        //  if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage authors')) {
        //      return response()->json(['error' => 'Only managers can register new admins.'], 403);
        //  }

       try{

         //----This validate for incoming value to not empty---//
         $validatedData = $request->validate([
            'name' => 'required|unique:authors',
        ],['name.required'=>'Name is required','name.unique'=>'Name already exists']);

      
            $result=Authors::create($validatedData);

            if($result){
                return response()->json([
                    'status'=>200,
                    'message'=>'Data inserted successfully'
            ]);
            }

            //----This return if the data does not enter into database----//
            return response()->json([
                'status'=>500,
                'message'=>'Data not inserted'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'=>500,
                'message'=>'Data not inserted'
            ]);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
       //------This is to find specific resource----//
       $result=Authors::where('id',$id)->first();

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
        $user = Auth::user();
        // dd($user->hasRole('manager'));
  
         // Check if the authenticated user is a 'manager'
         if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage authors')) {
             return response()->json(['error' => 'Only managers can register new admins.'], 403);
         }
        try{
            //----This validate for incoming value to not empty---//
            $validatedData = $request->validate([
                'name' => 'required|unique:authors',
            ],['name.required'=>'Name is required','name.unique'=>'Name already exists']);

            // dd($validatedData);
            $result=Authors::where('id',$id)->update($validatedData);
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
          $user = Auth::user();
        // dd($user->hasRole('manager'));
  
         // Check if the authenticated user is a 'manager'
         if (!$user || !$user->hasRole(['manager','librarian'])||!$user->can('manage authors')) {
             return response()->json(['error' => 'Only managers can register new admins.'], 403);
         }
         
        //---This is for delete processes----//
        try{
            $result=Authors::where('id',$id)->delete();

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
