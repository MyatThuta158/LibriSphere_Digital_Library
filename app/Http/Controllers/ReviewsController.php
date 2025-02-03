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
            'resource_id' => 'required|exists:resources,id',
            'user_id' => 'required|exists:users,id',
            'ReviewStar' => 'required|integer|min:1|max:5',
            'ReviewMessage' => 'required|string|max:500',
        ]);

        // Create a new review
        $review = Reviews::create([
            'resource_id' => $request->resource_id,
            'user_id' => $request->user_id,
            'ReviewStar' => $request->ReviewStar,
            'ReviewMessage' => $request->ReviewMessage,
        ]);

        // Return a success response with status 200
        return response()->json([
            'status' => 200,
            'message' => 'Review added successfully!',
            'review' => $review
        ], 200);
        
    } catch (\Exception $e) {
        // Return an error response with status 500
        return response()->json([
            'status' => 500,
            'message' => 'Failed to add review. Please try again.',
            'error' => $e->getMessage()
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
    public function update(Request $request, Reviews $reviews)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reviews $reviews)
    {
        //
    }
}
