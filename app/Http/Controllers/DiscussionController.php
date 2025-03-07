<?php
namespace App\Http\Controllers;

use App\Models\Discussion;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Code to list all discussions (if needed)
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // For web applications, return a view:
        // return view('discussions.create');

        // For APIs, you might simply return a placeholder response.
        return response()->json(['message' => 'Display form for creating discussion'], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Ensure the user is authenticated.
        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate the request.
        $validatedData = $request->validate([
            'ForumPostId' => 'required|integer|exists:forum_posts,ForumPostId', // Ensure the forum post exists.
            'Content'     => 'required|string',
        ]);

        // Merge the authenticated user's ID with the validated data.
        $validatedData['UserId'] = auth()->id();

        // Create the discussion.
        $discussion = Discussion::create($validatedData);

        return response()->json([
            'message' => 'Discussion created successfully',

        ], 201);
    }

    /**
     * Display the specified resource.
     */
    /**
     * Display discussions related to a forum post.
     */
    public function show($forumPostId)
    {
        // Retrieve discussions that belong to the given forum post ID,
        // including the user information for each discussion.
        $discussions = Discussion::where('ForumPostId', $forumPostId)
            ->with('user')
            ->get();

        return response()->json(['discussions' => $discussions], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discussion $discussion)
    {
        // For web applications, return a view:
        // return view('discussions.edit', compact('discussion'));

        // For APIs, you might return the discussion to be edited.
        return response()->json([
            'message'    => 'Display form for editing discussion',
            'discussion' => $discussion,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Retrieve the discussion by its id
        $discussion = Discussion::findOrFail($id);

        // Ensure the authenticated user is the owner of the discussion.
        if (auth()->id() !== $discussion->UserId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Validate the request.
        $validatedData = $request->validate([
            'Content' => 'required|string',
        ]);

        // Update the discussion with the validated data.
        $discussion->update($validatedData);

        return response()->json([
            'message'    => 'Discussion updated successfully',
            'discussion' => $discussion,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discussion $discussion)
    {
        // Ensure the authenticated user is the owner of the discussion.
        if (auth()->id() !== $discussion->UserId) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete the discussion.
        $discussion->delete();

        return response()->json([
            'message' => 'Discussion deleted successfully',
        ], 200);
    }
}
