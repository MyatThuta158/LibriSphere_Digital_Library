<?php
namespace App\Http\Controllers;

use App\Models\Votes;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VotesController extends Controller
{
    /**
     * Store a newly created vote in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'      => 'required|integer',
            'ForumPostId'  => 'required|integer',
            'vote_type_id' => 'required|integer|in:1,2',
        ]);

        // Optional: Check if the user has already voted on this post
        $existingVote = Votes::where('user_id', $data['user_id'])
            ->where('ForumPostId', $data['ForumPostId'])
            ->first();
        if ($existingVote) {
            return response()->json([
                'message' => 'User has already voted on this post.',
            ], 400);
        }

        // Create a new vote and return the vote record
        $vote = Votes::create($data);

        return response()->json([
            'message' => 'Vote recorded successfully.',
            'vote'    => $vote,
        ], 201);
    }

    /**
     * Update the specified vote in storage.
     * Allows user to update to the opposite vote.
     */
    public function update(Request $request, $id)
    {
        // Retrieve the vote record using its unique id
        $vote = Votes::findOrFail($id);

        try {
            // Validate that the new vote_type_id is provided and valid (1 for upvote or 2 for downvote)
            $data = $request->validate([
                'vote_type_id' => 'required|integer|in:1,2',
            ]);
        } catch (ValidationException $e) {
            // Return a JSON response with the validation error details.
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $e->errors(), // returns an array of field-specific error messages.
            ], 422);
        }

        // Check if the new vote type is different from the current vote type.
        if ($vote->vote_type_id == $data['vote_type_id']) {
            return response()->json([
                'message' => 'The vote type is the same as the current one.',
            ], 400);
        }

        // Update the vote with the new vote type.
        $vote->update(['vote_type_id' => $data['vote_type_id']]);

        return response()->json([
            'message' => 'Vote updated successfully.',
            'vote'    => $vote,
        ], 200);
    }

}
