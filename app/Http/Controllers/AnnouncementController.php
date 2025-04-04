<?php
namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AnnouncementController extends Controller
{
    /**
     * Display a paginated listing of the announcements.
     */
    public function index()
    {
        // $user = Auth::user();
        // if (! $user || ! $user->hasRole('manager')) {
        //     return response()->json([
        //         'error' => 'Only managers can view announcements.',
        //     ], 403);
        // }

        try {
            $announcements = Announcement::with('admin')->orderBy('created_at', 'desc')->get();

            return response()->json([
                'status'  => 200,
                'data'    => $announcements,
                'message' => 'Announcements fetched successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error'  => 'An error occurred while fetching announcements: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created announcement in storage.
     * Only managers can create announcements.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user || ! $user->hasRole('manager')) {
            return response()->json([
                'error' => 'Only managers can create announcements.',
            ], 403);
        }

        try {
            $validatedData = $request->validate([
                'title'       => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            // Set the admin_id from the authenticated manager.
            $validatedData['admin_id'] = $user->id;

            $announcement = Announcement::create($validatedData);

            return response()->json([
                'status'  => 200,
                'data'    => $announcement,
                'message' => 'Announcement created successfully!',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error'  => 'Error occurred while creating announcement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified announcement.
     */
    public function show($id)
    {
        $user = Auth::user();
        if (! $user || ! $user->hasRole('manager')) {
            return response()->json([
                'error' => 'Only managers can view announcements.',
            ], 403);
        }

        try {
            $announcement = Announcement::with('admin')->findOrFail($id);
            return response()->json([
                'status'  => 200,
                'data'    => $announcement,
                'message' => 'Announcement fetched successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 404,
                'error'  => 'Announcement not found!',
            ], 404);
        }
    }

    /**
     * Update the specified announcement in storage.
     * Only managers can update announcements.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (! $user || ! $user->hasRole('manager')) {
            return response()->json([
                'error' => 'Only managers can update announcements.',
            ], 403);
        }

        try {
            $announcement = Announcement::findOrFail($id);

            $validatedData = $request->validate([
                'title'       => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
            ]);

            $announcement->update($validatedData);

            return response()->json([
                'status'  => 200,
                'data'    => $announcement,
                'message' => 'Announcement updated successfully!',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'validation_failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error'  => 'Error occurred while updating announcement: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified announcement from storage.
     * Only managers can delete announcements.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (! $user || ! $user->hasRole('manager')) {
            return response()->json([
                'error' => 'Only managers can delete announcements.',
            ], 403);
        }

        try {
            $announcement = Announcement::findOrFail($id);
            $announcement->delete();

            return response()->json([
                'status'  => 200,
                'message' => 'Announcement deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error'  => 'Error occurred while deleting announcement: ' . $e->getMessage(),
            ], 500);
        }
    }
}
