<?php
namespace App\Http\Controllers;

use App\Models\SubscriberPrediction;
use Illuminate\Http\Request;

class SubscriberPredictionController extends Controller
{

    public function storePredictions(Request $request)
    {
        // Assuming the JSON data is sent as a "data" field in the request body.
        $predictionsData = $request->input('data');

        if (! $predictionsData || ! is_array($predictionsData)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid data provided.',
            ], 400);
        }

        // Retrieve the AdminId.
        $adminId = $request->user() ? $request->user()->id : $request->input('AdminId', null);

        // Loop through each subscription plan and store its prediction data.
        foreach ($predictionsData as $planData) {
            SubscriberPrediction::create([
                'SubscriptionPlanName' => $planData['SubscriptionPlanName'] ?? null,
                'Accuracy'             => $planData['Accuracy'] ?? null,
                // Always store the current date in YYYY-MM-DD format.
                'PredictedDate'        => date('Y-m-d'),
                '7DaysReport'          => $planData['7DaysReport'] ?? null,
                '14DaysReport'         => $planData['14DaysReport'] ?? null,
                '28DaysReport'         => $planData['28DaysReport'] ?? null,
                'AdminId'              => $adminId,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Predictions stored successfully.',
        ]);
    }

    public function getLatestPredictions()
    {
        // Retrieve the latest (maximum) predicted date from the database.
        $latestDate = SubscriberPrediction::max('PredictedDate');

        // If no records exist, return an appropriate response.
        if (! $latestDate) {
            return response()->json([
                'success' => false,
                'message' => 'No predictions found.',
            ], 404);
        }

        // Retrieve all predictions that have the latest date.
        $predictions = SubscriberPrediction::where('PredictedDate', $latestDate)->get();

        return response()->json([
            'success'     => true,
            'latest_date' => $latestDate,
            'data'        => $predictions,
        ]);
    }

}
