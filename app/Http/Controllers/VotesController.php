<?php
namespace App\Http\Controllers;

use App\Models\Votes;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class VotesController extends Controller
{

    public function countVotes($forumPostId)
    {
        $upvotes = Votes::where('ForumPostId', $forumPostId)
            ->where('vote_type_id', 1)
            ->count();

        $downvotes = Votes::where('ForumPostId', $forumPostId)
            ->where('vote_type_id', 2)
            ->count();

        return response()->json([
            'upvotes'   => $upvotes,
            'downvotes' => $downvotes,
        ], 200);
    }

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
    public function updateVote(Request $request)
    {

        try {
            $validate = $request->validate([
                'user_id'      => 'required|integer',
                'ForumPostId'  => 'required|integer',
                'vote_type_id' => 'required|integer|in:1,2',
            ]);

            //dd($validate);
            // Retrieve the vote record using its unique id
            $vote = Votes::where('user_id', $validate['user_id'])
                ->where('ForumPostId', $validate['ForumPostId'])
                ->first();
        } catch (ValidationException $e) {
            // Return a JSON response with the validation error details.
            return response()->json([
                'message' => 'Validation error',
                'errors'  => $e->errors(), // returns an array of field-specific error messages.
            ], 422);
        }

        // Check if the new vote type is different from the current vote type.
        if ($vote->vote_type_id == $validate['vote_type_id']) {
            return response()->json([
                'message' => 'The vote type is the same as the current one.',
            ], 400);
        }

        // Update the vote with the new vote type.
        $vote->update(['vote_type_id' => $validate['vote_type_id']]);

        return response()->json([
            'message' => 'Vote updated successfully.',
            'vote'    => $vote,
        ], 200);
    }

    public function getVoters($forumPostId)
    {
        // Retrieve votes for the given post and eager-load the user and votetypes relationships.
        $votes = Votes::with('user', 'voteType')->where('ForumPostId', $forumPostId)->get();

        // Map each vote to include user data and the vote_type_id.
        $voters = $votes->map(function ($vote) {
            return [
                'user'         => $vote->user,
                'vote_type_id' => $vote->vote_type_id,
            ];
        })->unique(function ($item) {
            return $item['user']['id']; // Ensure each user appears only once.
        })->values();

        return response()->json([
            'voters' => $voters,
        ], 200);
    }

    public function delete(Request $request)
    {
        $data = $request->validate([
            'user_id'     => 'required|integer',
            'ForumPostId' => 'required|integer',
        ]);

        $vote = Votes::where('user_id', $data['user_id'])
            ->where('ForumPostId', $data['ForumPostId'])
            ->first();

        if (! $vote) {
            return response()->json([
                'message' => 'Vote not found.',
            ], 404);
        }

        $vote->delete();

        return response()->json([
            'message' => 'Vote deleted successfully.',
        ], 200);
    }

}
