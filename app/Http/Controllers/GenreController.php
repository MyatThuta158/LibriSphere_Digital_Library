<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $allData=Genre::all();
        return response()->json(['status'=>200,'data'=>$allData]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{

            //----This validate for incoming value to not empty---//
            $validatedData = $request->validate([
               'name' => 'required|unique:genres',
           ],['name.required'=>'Name is required','name.unique'=>'Name already exists']);
   
         
               $result=Genre::create([
                     'name'=>$validatedData['name'],
               ]);
   
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
                   'message'=>'Validation error'
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
