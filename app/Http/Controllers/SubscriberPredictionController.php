<?php
namespace App\Http\Controllers;

use App\Models\SubscriberPrediction;
use Illuminate\Http\Request;

class SubscriberPredictionController extends Controller
{

    public function storePredictions(Request $request)
    {
        // Assuming the JSON data is sent as a "data" field in the request body.
        // Adjust the key if the data is sent differently.
        $predictionsData = $request->input('data');

        if (! $predictionsData || ! is_array($predictionsData)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid data provided.',
            ], 400);
        }

        // Retrieve the AdminId.
        // If you're using authentication, you can use $request->user()->id.
        // Otherwise, you can pass it in the request, for example as "AdminId".
        $adminId = $request->user() ? $request->user()->id : $request->input('AdminId', null);

        // Loop through each subscription plan and store its prediction data.
        foreach ($predictionsData as $planName => $planData) {
            SubscriberPrediction::create([
                'SubscriptionPlanName' => $planName,
                'Accuracy'             => $planData['metrics']['accuracy'] ?? null,
                'PredictedDate'        => $planData['last_training_date'] ?? null,
                '7DaysReport'          => $planData['predictions']['next_7_days'] ?? null,
                '14DaysReport'         => $planData['predictions']['next_14_days'] ?? null,
                '28DaysReport'         => $planData['predictions']['next_28_days'] ?? null,
                'AdminId'              => $adminId,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Predictions stored successfully.',
        ]);
    }

}
