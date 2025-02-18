<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Request_Resources;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class RequestResourcesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requests = Request_Resources::with('user:id,name')->paginate(8);
    
        return response()->json(['data' => $requests], 200);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         ob_clean();

        // $user = Auth::user();
    
        // // Check if the authenticated user has the required roles and permissions
        // if (!$user || !$user->hasRole(['manager', 'librarian','member']) || !$user->can('manage request')) {
        //     return response()->json(['error' => 'Only managers and librarians can add resources.'], 403);
        // }
    
        // Validate request input
        $validate = $request->validate([
            'user_id'=>'required|exists:users,id',
            'Title' => 'required|string|max:255',
            'ISBN' => 'nullable|string|max:255',
            'Author' => 'nullable|string|max:255',
            'Language' => 'required|string|max:255',
            'PublishYear' => 'nullable|string|max:255',
            'Resource_Photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        try {
            $photoPath = null;
    
            // Handle file upload if exists
            if ($request->hasFile('Resource_Photo')) {
                $photo = $request->file('Resource_Photo');
                $photoPath = $photo->store('request_resources', 'public');
            }
    
            // Store resource in the database
            $result = Request_Resources::create([
                'user_id'=>$validate['user_id'],
                'Title' => $validate['Title'],
                'ISBN' => $validate['ISBN'] ?? null,
                'Author' => $validate['Author'] ?? null,
                'Language' => $validate['Language'],
                'PublishYear' => $validate['PublishYear'] ?? null,
                'Resource_Photo' => $photoPath,
                'NotificationStatus'=>'Unwatched',
            ]);
    
            if ($result) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Resource request is successfully',
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => 'Failed to request',
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'An error occurred while adding the request',
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        ob_clean();

        $user = Auth::user();
        
      //  dd($user);
        // Check if the authenticated user has the required roles and permissions
        // if (!$user || !$user->hasRole(['manager', 'librarian','member']) || !$user->can('manage request')) {
        //     return response()->json(['error' => 'Only managers and librarians can add resources.'], 403);
        // }

        $resource=Request_Resources::where('user_id',$id)->get();

     

        if (!$resource) {
            return response()->json(['error' => 'Resource not found'], 405);
        }
    
        return response()->json(['data' => $resource], 200);

        //return response()->json(['data'=>$resource],200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request_Resources $request_Resources)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Request_Resources $request_Resources)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request_Resources $request_Resources)
    {
        //
    }

    //-------This is to save admin comments----//


    public function updateAdminComment(Request $request, $id)
    {
        try {
            // Validate the request
            $request->validate([
                'Admin_Comment' => 'required|string|max:500',
            ]);
    
            // Find the resource
            $resource = Request_Resources::find($id);
    
            if (!$resource) {
                Log::error("Update Admin Comment Failed: Resource with ID {$id} not found.");
                return response()->json(['message' => 'Resource not found'], 404);
            }
    
            // Update and save the admin comment
            $resource->Admin_Comment = $request->Admin_Comment;
            $resource->NotificationStatus="Unwatched";
            $resource->save();
    
            return response()->json(['message' => 'Admin comment updated successfully']);
        } catch (\Exception $e) {
            Log::error("Update Admin Comment Error: " . $e->getMessage(), [
                'id' => $id,
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
    
            return response()->json(['message' => 'An error occurred while updating the admin comment'], 500);
        }
    }
    

    public function updateNotificationStatus(Request $request, $id)
    {
        try {
            // Validate the request
            $request->validate([
                'NotificationStatus' => 'required|string|in:Unwatched,Watched',
            ]);

            // Find the resource
            $resource = Request_Resources::find($id);

            if (!$resource) {
                return response()->json(['message' => 'Resource not found'], 404);
            }

            // Update and save the notification status
            $resource->NotificationStatus = $request->NotificationStatus;
            $resource->save();

            return response()->json([
                'message' => 'Notification status updated successfully',
                'data' => $resource
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the notification status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}
