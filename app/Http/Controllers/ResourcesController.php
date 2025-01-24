<?php

namespace App\Http\Controllers;

use App\Models\Resources;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResourcesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resources=Resources::paginate(8);

        return response()->json(['data'=>$resources],200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        ob_clean(); 
        //----This is validate the resource store---//
        $validate = $request->validate([
            'code' => 'required',
            'name' => 'required',
            'date' => 'required',
            'Photo' => 'required', // Ensuring it's a valid file
            'file' => 'required', // Ensuring it's a valid file
            'author' => 'required|exists:authors,id',
            'genre' => 'required',
            'genre.*' => 'required',
            'Description' => 'required',
        ]);


    
        //----This is for store the resource---//
        try {
            if ($request->hasFile('Photo') && $request->hasFile('file')) {
                /////----This is for file storage processes---//
                $photo = $request->file('Photo');
                $photoPath = $photo->store('userimg', 'public');



                $test=$request->hasFile('Photo');
                

                $file = $request->file('file');
                $filePath = $file->store('resources', 'public');
               
               
    
                if ($photoPath && $filePath) {

                    $result = Resources::create([
                        'code'=>$validate['code'],
                        'name' => $validate['name'],
                        'publish_date' => $validate['date'],
                        'cover_photo' => $photoPath,
                        'file' => $filePath,
                        'author_id' => $validate['author'],
                        'Description' => $validate['Description'],
                    ]);

                    $genre=$validate['genre'];
                    $genreArr=json_decode($genre,true);

                    // Attach genres (many-to-many relation)
                    $result->genre()->attach($genreArr);
    
                    return response()->json([
                        'status' => 200,
                        'message' => 'Data inserted successfully'
                    ]);
                } else {
                 
                    return response()->json([
                        'status' => 400,
                        'message' => 'File path error'
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'File problems'
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Data not inserted',
               
            ]);
        }
    }
    

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try{
            $resource=Resources::find($id); //----This get the resource from database---//

            //dd($resource);
            if ($resource) {
                return response()->json(['message'=>$resource]); //-----This is the return message with data----//
            }else{
                return response()->json(['message'=>"No data found"]); //----This is the message when data not found--//
            }
        }catch(\Exception $e){
            return response()->json(['message'=>'Error in data fetching!']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Resources $resources)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resources $resources)
    {
        //
    }
}
