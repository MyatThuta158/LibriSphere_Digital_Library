<?php
namespace App\Http\Controllers;

use App\Models\UserPredictionInformation;
use Illuminate\Http\Request;

class UserPredictionInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve the most recent prediction record
        $lastPrediction = UserPredictionInformation::orderBy('id', 'desc')->first();

        if (! $lastPrediction) {
            return response()->json(['message' => 'No prediction information found.'], 404);
        }

        return response()->json([
            'last_information_date' => $lastPrediction->PredictedDate,
            'data'                  => $lastPrediction,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'Accuracy'      => 'required|string',
            'PredictedDate' => 'required|date',
            // Note: Even though the field names start with numbers, they are string keys in arrays.
            '7DaysReport'   => 'required|string',
            '14DaysReport'  => 'required|string',
            '28DaysReport'  => 'required|string',
            'AdminId'       => 'required|exists:admins,id',
        ]);

        // Create a new prediction record
        $prediction = UserPredictionInformation::create($validatedData);

        // Return a JSON response indicating success
        return response()->json([
            'message' => 'User prediction information stored successfully.',
            'data'    => $prediction,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
