<?php
namespace App\Http\Controllers;

use App\Models\RevenuePrediction;
use Illuminate\Http\Request;

class RevenuePredictionController extends Controller
{
    /**
     * Store revenue predictions from JSON payload.
     */
    public function storeRevenuePredictions(Request $request)
    {
        // Assuming the JSON array is sent as 'data' in request body
        $predictionsData = $request->input('data');

        if (! is_array($predictionsData)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or missing data array.',
            ], 400);
        }

        // Determine AdminId: from authenticated user or explicit input
        $adminId = $request->user() ? $request->user()->id : $request->input('AdminId');

        foreach ($predictionsData as $item) {
            RevenuePrediction::create([
                'SubscriptionPlanName' => $item['SubscriptionPlanName'] ?? null,
                'Accuracy'             => $item['Accuracy'] ?? null,
                'PredictedDate'        => $item['PredictedDate'] ?? date('Y-m-d'),
                '7DaysReport'          => $item['7DaysReport'] ?? null,
                '14DaysReport'         => $item['14DaysReport'] ?? null,
                '28DaysReport'         => $item['28DaysReport'] ?? null,
                'AdminId'              => $adminId,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Revenue predictions stored successfully.',
        ]);
    }

    /**
     * Retrieve the most recent revenue predictions by PredictedDate.
     */
    public function getLatestRevenuePredictions()
    {
        $latestDate = RevenuePrediction::max('PredictedDate');

        if (! $latestDate) {
            return response()->json([
                'success' => false,
                'message' => 'No revenue predictions found.',
            ], 404);
        }

        $predictions = RevenuePrediction::where('PredictedDate', $latestDate)->get();

        return response()->json([
            'success'     => true,
            'latest_date' => $latestDate,
            'data'        => $predictions,
        ]);
    }
}
