<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
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
        ob_clean();
            // Validate the request
  try{
    $validate = $request->validate([
        'admin_id' => 'nullable|exists:admins,id',
        'membership_plans_id' => 'required|exists:membership_plans,id',
        'payment__types_id' => 'required|exists:payment__types,id',
        'users_id' => 'required|exists:users,id',
        'PaymentScreenShot' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        'PaymentAccountName' => 'required|string|max:255',
        'PaymentAccountNumber' => 'required|string|max:255',
        'PaymentDate' => 'required|date',
        'MemberstartDate' => 'required|date',
        'MemberEndDate' => 'required|date|after:MemberstartDate',
        
    ]);
  }catch(ValidationException $e){
    return response()->json(['message'=>$e->errors()],500);
  }

    try {
        // Handle file upload for PaymentScreenShot
        if ($request->hasFile('PaymentScreenShot')) {
            $paymentScreenshotFile = $request->file('PaymentScreenShot');
            $paymentScreenshotPath = $paymentScreenshotFile->store('subscriptions', 'public');

            // Store subscription in the database
            $subscription = Subscription::create([
                'admin_id' => $validate['admin_id'],
                'membership_plans_id' => $validate['membership_plans_id'],
                'payment__types_id' => $validate['payment__types_id'],
                'users_id' => $validate['users_id'],
                'PaymentScreenShot' => $paymentScreenshotPath,
                'PaymentAccountName' => $validate['PaymentAccountName'],
                'PaymentAccountNumber' => $validate['PaymentAccountNumber'],
                'PaymentDate' => $validate['PaymentDate'],
                'MemberstartDate' => $validate['MemberstartDate'],
                'MemberEndDate' => $validate['MemberEndDate'],
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'Subscription created successfully',
                'data' => $subscription
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'message' => 'Payment screenshot upload failed'
            ]);
        }
    } catch (\Exception $e) {
        Log::error('Subscription Store Error: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);
    
        return response()->json([
            'status' => 500,
            'message' => 'An error occurred while saving the subscription',
            'error' => $e->getMessage()
        ]);
    }
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $subscription)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $subscription)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Subscription $subscription)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $subscription)
    {
        //
    }
}
