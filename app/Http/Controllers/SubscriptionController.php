<?php
namespace App\Http\Controllers;

use App\Models\MembershipPlan;
use App\Models\Subscription;
use App\Models\SubscriptionNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
        $user = Auth::user();

        //dd($user);

        // Validate the request (removed MemberstartDate and MemberEndDate)
        try {
            $validate = $request->validate([
                'admin_id'             => 'nullable|exists:admins,id',
                'membership_plans_id'  => 'required|exists:membership_plans,id',
                'payment_types_id'     => 'required|exists:payment_types,id',
                'PaymentScreenShot'    => 'required|image|mimes:jpeg,png,jpg,gif,svg',
                'PaymentAccountName'   => 'required|string|max:255',
                'PaymentAccountNumber' => 'required|string|max:255',
                'PaymentDate'          => 'required|date',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->errors()], 500);
        }

        try {
            // Handle file upload for PaymentScreenShot
            if ($request->hasFile('PaymentScreenShot')) {
                $paymentScreenshotFile = $request->file('PaymentScreenShot');
                $paymentScreenshotPath = $paymentScreenshotFile->store('subscriptions', 'public');

                // Check for an active subscription for this user
                $activeSubscription = Subscription::where('users_id', $user->id)
                    ->where('SubscriptionStatus', 'active')
                    ->first();

                // Retrieve the membership plan to get its duration (in months)
                $membershipPlan   = MembershipPlan::find($validate['membership_plans_id']);
                $durationInMonths = $membershipPlan->Duration; // e.g., 1 means one month

                $today = Carbon::now();

                if ($activeSubscription) {
                    $activeEndDate = Carbon::parse($activeSubscription->MemberEndDate);
                    // If current subscription is still active, extend from its end date
                    if ($today->lessThan($activeEndDate)) {
                        $memberStartDate = $today;
                        $memberEndDate   = $activeEndDate->copy()->addMonths($durationInMonths);
                    } else {
                        // Active subscription exists but has expired; start new period from today
                        $memberStartDate = $today;
                        $memberEndDate   = $today->copy()->addMonths($durationInMonths);
                    }
                } else {
                    // No active subscription; use today's date for new subscription
                    $memberStartDate = $today;
                    $memberEndDate   = $today->copy()->addMonths($durationInMonths);
                }

                // Create the new subscription using the calculated dates
                $subscription = Subscription::create([
                    'admin_id'             => $validate['admin_id'] ?? null,
                    'membership_plans_id'  => $validate['membership_plans_id'],
                    'payment_types_id'     => $validate['payment_types_id'],
                    'users_id'             => $user->id,
                    'PaymentScreenShot'    => $paymentScreenshotPath,
                    'PaymentAccountName'   => $validate['PaymentAccountName'],
                    'PaymentAccountNumber' => $validate['PaymentAccountNumber'],
                    'PaymentDate'          => $validate['PaymentDate'],
                    'MemberstartDate'      => $memberStartDate->toDateString(),
                    'MemberEndDate'        => $memberEndDate->toDateString(),
                    'PaymentStatus'        => "pending",
                    'SubscriptionStatus'   => 'active',
                ]);

                // If an active subscription exists, update its status to 'inactive'
                if ($activeSubscription) {
                    $activeSubscription->update(['SubscriptionStatus' => 'inactive']);
                    $notificationMsg = "Your subscription plan is extend and the expired date is " . $memberEndDate->toDateString();
                } else {
                    $notificationMsg = "Your subscription expired date is " . $memberEndDate->toDateString();
                }

                // Create the notification for the subscription
                SubscriptionNotification::create([
                    'SubscriptionId' => $subscription->id,
                    'Description'    => $notificationMsg,
                    'WatchStatus'    => 'unwatch',
                ]);

                return response()->json([
                    'status'  => 200,
                    'message' => 'Subscription created successfully',
                    'data'    => $subscription,
                ]);
            } else {
                return response()->json([
                    'status'  => 400,
                    'message' => 'Payment screenshot upload failed',
                ]);
            }
        } catch (\Exception $e) {
            // Log the error with additional context.
            Log::error('Subscription Store Error: ' . $e->getMessage(), [
                'trace'        => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'status'  => 500,
                'message' => 'An error occurred while saving the subscription',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $subscription = Subscription::with(['user', 'paymentType']) // Fetch all user & paymentType data
            ->find($id);

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'   => [
                'subscription_id'    => $subscription->id,
                'user'               => [
                    'id'           => $subscription->user->id ?? null,
                    'name'         => $subscription->user->name ?? null,
                    'email'        => $subscription->user->email ?? null,
                    'phone_number' => $subscription->user->phone_number ?? null,
                    'profile_pic'  => $subscription->user->ProfilePic ?? null,
                ],
                'membership_plan_id' => $subscription->membership_plans_id,
                'payment'            => [
                    'payment_type'           => $subscription->paymentType->PaymentTypeName ?? null,
                    'payment_screenshot'     => $subscription->PaymentScreenShot,
                    'payment_account_name'   => $subscription->PaymentAccountName,
                    'payment_account_number' => $subscription->PaymentAccountNumber,
                    'payment_date'           => $subscription->PaymentDate,
                    'payment_status'         => $subscription->PaymentStatus,
                ],
                'member_start_date'  => $subscription->MemberstartDate,
                'member_end_date'    => $subscription->MemberEndDate,
                'admin_id'           => $subscription->admin_id,
            ],
        ]);
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

    //--------This is to return payment show----///
    public function getSubscriptionDetails()
    {
        $subscriptions = Subscription::with(['user:id,name,email,ProfilePic', 'paymentType:id,PaymentTypeName'])
            ->select('users_id', 'payment_types_id', 'id', 'PaymentDate', 'PaymentStatus')
            ->paginate(3)                        // Paginate with 10 records per page
            ->through(function ($subscription) { // Use `through` instead of `map()` for pagination
                return [
                    'sid'          => $subscription->id,
                    'email'        => $subscription->user->email ?? null,
                    'name'         => $subscription->user->name ?? null, // Fetch customer name
                    'memberpic'    => $subscription->user->ProfilePic ?? null,
                    'payment_date' => $subscription->PaymentDate,
                    'payment_type' => $subscription->paymentType->PaymentTypeName ?? null,
                    'status'       => $subscription->PaymentStatus,
                ];
            });

        return response()->json([
            'status' => 200,
            'data'   => $subscriptions, // Laravel pagination returns metadata like links, current page, etc.
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        // Validate request
        $request->validate([
            'payment_status' => 'required|string|in:Pending,Approved,Rejected',
        ]);

        // Find the subscription
        $subscription = Subscription::find($id);

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Update the payment status
        $subscription->PaymentStatus = $request->payment_status;
        $subscription->save();

        // Get the associated user
        $user = $subscription->user;

        if ($user) {
            try {
                if ($request->payment_status === "Approved") {
                    $user->update(['role' => 'member']);
                    $user->syncRoles('member');
                } elseif ($request->payment_status === "Rejected") {
                    $user->update(['role' => 'community_member']);
                    $user->syncRoles('community_member');
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Failed to update user role',
                    'error'   => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Payment status updated successfully',
            'data'    => $subscription,
        ]);
    }

}
