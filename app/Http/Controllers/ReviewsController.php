<?php
namespace App\Http\Controllers;

use App\Models\Reviews;
use Illuminate\Http\Request;

class ReviewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        try {
            // Validate the request data
            $request->validate([
                'resource_id'   => 'required|exists:resources,id',
                'user_id'       => 'required|exists:users,id',
                'ReviewStar'    => 'required|integer|min:1|max:5',
                'ReviewMessage' => 'required|string|max:500',
            ]);

            // Create a new review
            $review = Reviews::create([
                'resource_id'   => $request->resource_id,
                'user_id'       => $request->user_id,
                'ReviewStar'    => $request->ReviewStar,
                'ReviewMessage' => $request->ReviewMessage,
            ]);

            // Return a success response with status 200
            return response()->json([
                'status'  => 200,
                'message' => 'Review added successfully!',
                'review'  => $review,
            ], 200);

        } catch (\Exception $e) {
            // Return an error response with status 500
            return response()->json([
                'status'  => 500,
                'message' => 'Failed to add review. Please try again.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

//-------This is to display reviews-----------//
    public function getReviewsByResourceId($resourceId)
    {
        try {
            // Retrieve reviews along with the user's name using a join
            $reviews = Reviews::select('reviews.*', 'users.name as user_name', 'users.ProfilePic', 'users.id as user_id')
                ->join('users', 'reviews.user_id', '=', 'users.id')
                ->where('reviews.resource_id', $resourceId)
                ->get();

            // dd($reviews);

            return response()->json([
                'status'  => 200,
                'reviews' => $reviews,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Failed to retrieve reviews.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Reviews $reviews)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reviews $reviews)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Validate input only if provided, using 'sometimes'
            $validated = $request->validate([
                'ReviewStar'    => 'required|required|integer|min:1|max:5',
                'ReviewMessage' => 'required|required|string|max:500',
            ]);

            // Retrieve the review by its ID
            $review = Reviews::findOrFail($id);

            // Check if the review belongs to the user making the request
            if ($review->user_id != $request->user_id) {
                return response()->json([
                    'status'  => 403,
                    'message' => 'You are not authorized to update this review.',
                ], 403);
            }

            // Prepare data for update, only including fields present in the request
            $data = [];
            if ($request->has('ReviewStar')) {
                $data['ReviewStar'] = $request->ReviewStar;
            }
            if ($request->has('ReviewMessage')) {
                $data['ReviewMessage'] = $request->ReviewMessage;
            }

            // Update the review using the update() method
            $review->update($data);

            return response()->json([
                'status'  => 200,
                'message' => 'Review updated successfully!',
                'review'  => $review,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 500,
                'message' => 'Failed to update review. Please try again.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            // Retrieve the review by its ID; if not found, findOrFail throws a ModelNotFoundException
            $review = Reviews::findOrFail($id);

            //dd($review);
            // Delete the review
            $review->delete();

            // Return a success response
            return response()->json([
                'status'  => 200,
                'message' => 'Review deleted successfully!',
            ], 200);
        } catch (\Exception $e) {
            // Return an error response if something goes wrong
            return response()->json([
                'status'  => 500,
                'message' => 'Failed to delete review. Please try again.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

}
