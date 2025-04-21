<?php
namespace App\Http\Controllers;

use App\Models\MembershipPlan;
use App\Models\Subscription;
use App\Models\SubscriptionNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SubscriptionController extends Controller
{
    public function getUserSubscriptionInfo($id)
    {
        // Retrieve the user id from the request
        if (! $id) {
            return response()->json([
                'status'  => 400,
                'message' => 'User id is required',
            ], 400);
        }

        // Fetch the latest subscription for the user along with its membership plan
        $subscription = Subscription::with('membershipPlan')
            ->where('users_id', $id)
            ->latest('MemberstartDate')
            ->first();

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found for the given user',
            ], 404);
        }

        // Calculate days left ensuring the value is an integer
        $today         = Carbon::now();
        $memberEndDate = Carbon::parse($subscription->MemberEndDate);
        $daysLeft      = $today->lessThanOrEqualTo($memberEndDate)
        ? (int) $today->diffInDays($memberEndDate)
        : 0;

        // Prepare the data to return, including the subscription end date.
        $data = [
            'subscription_id'       => $subscription->id,
            'membership_plan_name'  => $subscription->membershipPlan->PlanName ?? 'N/A', // Adjust if your field name differs
            'subscribed_date'       => $subscription->MemberstartDate,
            'subscription_end_date' => $subscription->MemberEndDate,
            'days_left'             => $daysLeft,
        ];

        return response()->json([
            'status' => 200,
            'data'   => $data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();
        // $user = Auth::user();

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
                'users_id'             => 'required|exists:users,id',
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
                $activeSubscription = Subscription::where('users_id', $validate['users_id'], )
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
                    'users_id'             => $validate['users_id'],
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
                }

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

    public function showResubmit($id)
    {
        // Retrieve the subscription along with user, paymentType, and latest notification
        $subscription = Subscription::with([
            'user',
            'paymentType',
            'membershipPlan',
            'subscriptionNotifications' => function ($query) {
                $query->latest()->limit(1);
            },
        ])->find($id);

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Retrieve the latest notification (if it exists)
        $latestNotification = $subscription->subscriptionNotifications->first();

        return response()->json([
            'status' => 200,
            'data'   => [
                'subscription_id'     => $subscription->id,
                'user'                => [
                    'id'           => $subscription->user->id ?? null,
                    'name'         => $subscription->user->name ?? null,
                    'email'        => $subscription->user->email ?? null,
                    'phone_number' => $subscription->user->phone_number ?? null,
                    'profile_pic'  => $subscription->user->ProfilePic ?? null,
                ],
                'membership'          => $subscription->membershipPlan,
                'payment'             => [
                    // Payment type information from the related paymentType model
                    'payment_type'           => $subscription->paymentType->PaymentTypeName ?? null,
                    // Subscription's own payment details
                    'payment_screenshot'     => $subscription->PaymentScreenShot,
                    'payment_account_name'   => $subscription->PaymentAccountName,
                    'payment_account_number' => $subscription->PaymentAccountNumber,
                    'payment_date'           => $subscription->PaymentDate,
                    'payment_status'         => $subscription->PaymentStatus,
                ],

                'payment_type'        => $subscription->paymentType,
                'membership_plan_id'  => $subscription->membership_plans_id,
                'member_start_date'   => $subscription->MemberstartDate,
                'member_end_date'     => $subscription->MemberEndDate,
                'admin_id'            => $subscription->admin_id,
                'latest_notification' => $latestNotification ? [
                    'description'  => $latestNotification->Description,
                    'watch_status' => $latestNotification->WatchStatus,
                ] : null,
            ],
        ]);
    }

    ///------------This is for subscription update if reject-----//
    public function update(Request $request, $id)
    {
        ob_clean();
        // Find the subscription by its id
        $subscription = Subscription::find($id);
        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Validate only the fields that need to be updated
        $validatedData = $request->validate([
            'PaymentScreenShot'    => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'PaymentAccountName'   => 'nullable|string|max:255',
            'PaymentAccountNumber' => 'nullable|string|max:255',
            'PaymentDate'          => 'nullable|date',

        ]);

        $validatedData['PaymentStatus'] = 'Resubmit';

        // Handle file upload for PaymentScreenShot if provided
        if ($request->hasFile('PaymentScreenShot')) {
            $paymentScreenshotFile              = $request->file('PaymentScreenShot');
            $paymentScreenshotPath              = $paymentScreenshotFile->store('subscriptions', 'public');
            $validatedData['PaymentScreenShot'] = $paymentScreenshotPath;
        }

        // Update only the provided fields
        $subscription->update($validatedData);

        // Save notification information after the payment is updated
        SubscriptionNotification::create([
            'SubscriptionId' => $subscription->id,
            'Description'    => 'You cannot access the digital library until the admin accept the payment. This process can take 24 hours and please wait',
            'WatchStatus'    => 'unwatch',
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Subscription updated successfully',
            'data'    => $subscription,
        ]);
    }

    public function showReject($id)
    {
        $subscription = Subscription::with([
            'user',
            'paymentType',
            'subscriptionNotifications', // Eager-load notifications
        ])->find($id);

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Get the most recent notification (if any)
        $notification = $subscription->subscriptionNotifications()->latest()->first();

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
                // Include notification details if available
                'notification'       => $notification ? [
                    'description'  => $notification->Description,
                    'watch_status' => $notification->WatchStatus,
                ] : null,
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

    /**
     * Remove the specified resource from storage.
     */
    public function showSubscriptionDetailWithLatestNotification($id)
    {
        // Retrieve the subscription with related user, paymentType, membershipPlan,
        // and only the latest subscription notification.
        $subscription = Subscription::with([
            'user',
            'paymentType',
            'membershipPlan',
            'subscriptionNotifications' => function ($query) {
                $query->latest()->limit(1);
            },
        ])->find($id);

        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Get the latest notification from the collection (if any)
        $latestNotification = $subscription->subscriptionNotifications->first();

        return response()->json([
            'status' => 200,
            'data'   => [
                'subscription_id'     => $subscription->id,
                'user'                => [
                    'id'           => $subscription->user->id ?? null,
                    'name'         => $subscription->user->name ?? null,
                    'email'        => $subscription->user->email ?? null,
                    'phone_number' => $subscription->user->phone_number ?? null,
                    'profile_pic'  => $subscription->user->ProfilePic ?? null,
                ],
                'membership_plan'     => $subscription->membershipPlan,
                'payment'             => [
                    'payment_type'           => $subscription->paymentType->PaymentTypeName ?? null,
                    'payment_screenshot'     => $subscription->PaymentScreenShot,
                    'payment_account_name'   => $subscription->PaymentAccountName,
                    'payment_account_number' => $subscription->PaymentAccountNumber,
                    'payment_date'           => $subscription->PaymentDate,
                    'payment_status'         => $subscription->PaymentStatus,
                ],
                'member_start_date'   => $subscription->MemberstartDate,
                'member_end_date'     => $subscription->MemberEndDate,
                'admin_id'            => $subscription->admin_id,
                'latest_notification' => $latestNotification ? [
                    'description'  => $latestNotification->Description,
                    'watch_status' => $latestNotification->WatchStatus,
                ] : null,
            ],
        ]);
    }

    //--------This is to return payment show----///
    public function getSubscriptionDetails(Request $request)
    {
        // Retrieve status from request, if provided
        $status = $request->input('status');

        // Start building the query with eager-loading
        $query = Subscription::with([
            'user:id,name,email,ProfilePic',
            'paymentType:id,PaymentTypeName',
        ])->select('users_id', 'payment_types_id', 'id', 'PaymentDate', 'PaymentStatus');

        // Check if status is provided and is one of the allowed values
        if ($status && in_array($status, ['pending', 'Rejected', 'Approved', "Resubmit"])) {
            $query->where('PaymentStatus', $status);
        }

        // Paginate the result (3 records per page) and transform each subscription
        $subscriptions = $query->paginate(3)
            ->through(function ($subscription) {
                return [
                    'sid'          => $subscription->id,
                    'email'        => $subscription->user->email ?? null,
                    'name'         => $subscription->user->name ?? null,
                    'memberpic'    => $subscription->user->ProfilePic ?? null,
                    'payment_date' => $subscription->PaymentDate,
                    'payment_type' => $subscription->paymentType->PaymentTypeName ?? null,
                    'status'       => $subscription->PaymentStatus,
                ];
            });

        return response()->json([
            'status' => 200,
            'data'   => $subscriptions,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        // Validate request. 'notification_description' is required when payment_status is Rejected.
        $request->validate([
            'payment_status'           => 'required|string|in:pending,Approved,Rejected,Resubmit',
            'notification_description' => 'required_if:payment_status,Rejected',
        ]);

        // Find the subscription
        $subscription = Subscription::find($id);
        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Determine subscription and payment statuses based on payment_status value
        $status = $request->payment_status;
        if ($status === "Approved") {
            $subscription->SubscriptionStatus = 'active';
            $subscription->PaymentStatus      = 'Approved';
            // Set admin approve date to today's date using Carbon
            $subscription->AdminApprovedDate = Carbon::now()->toDateTimeString();
        } elseif ($status === "Rejected") {
            $subscription->SubscriptionStatus = 'inactive';
            $subscription->PaymentStatus      = 'Rejected';
        } elseif ($status === "Resubmit") {
            $subscription->SubscriptionStatus = 'inactive';
            $subscription->PaymentStatus      = 'Resubmit';
        } elseif ($status === "pending") {
            $subscription->SubscriptionStatus = 'active';
            $subscription->PaymentStatus      = 'pending';
        }

        // If the authenticated user is a librarian or manager,
        // record their id in the subscription (assuming an 'admin_id' column exists)
        $authUser = auth()->user();
        if ($authUser && in_array($authUser->role, ['librarian', 'manager'])) {
            $subscription->admin_id = $authUser->id;
        }

        $subscription->save();

        // Get the associated user
        $user = $subscription->user;
        if ($user) {
            try {
                if ($status === "Approved") {
                    $user->update(['role' => 'member']);
                    $user->syncRoles('member');
                } elseif (in_array($status, ['Rejected', 'Resubmit', 'cancel'])) {
                    // For these statuses, set the role to community_member
                    $user->update(['role' => 'community_member']);
                    $user->syncRoles('community_member');
                }
                // For Resubmit or pending, no role change is applied.
            } catch (\Exception $e) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Failed to update user role',
                    'error'   => $e->getMessage(),
                ], 500);
            }
        }

        // Prepare notification description based on the payment status
        if ($status === "Approved") {
            $description = "Your subscription expired date is " . $subscription->MemberEndDate;
        } elseif ($status === "Rejected") {
            $description = $request->notification_description;
        } elseif ($status === "Resubmit") {
            $description = "Your payment has been resubmitted. Please wait for admin to review your payment.";
        } else {
            // pending status; if needed, you can customize this message.
            $description = "Your subscription payment is pending.";
        }

        // Create a notification if the payment status is one of Approved, Rejected, Resubmit, or pending if required.
        if (in_array($status, ['Approved', 'Rejected', 'Resubmit', 'pending'])) {
            SubscriptionNotification::create([
                'SubscriptionId' => $subscription->id,
                'Description'    => $description,
                'WatchStatus'    => 'unwatch',
            ]);
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Payment status updated successfully',
            'data'    => $subscription,
        ]);
    }
    public function cancelSubscriptionOnly(Request $request, $id)
    {
        // Retrieve the subscription along with its membership plan.
        $subscription = Subscription::with('membershipPlan')->find($id);
        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Update subscription status fields.
        $subscription->PaymentStatus      = 'cancel';
        $subscription->SubscriptionStatus = 'inactive';

        // Check if the authenticated user is either 'librarian' or 'manager'
        $user = auth()->user();
        if ($user && in_array($user->role, ['librarian', 'manager'])) {
            // Record the user id who canceled (assuming a 'cancelled_by' column exists in your subscriptions table)
            $subscription->admin_id = $user->id;
        }

        $subscription->save();

        // Update the associated user role to 'community_member' when the subscription is canceled.
        // Assumes that the Subscription model has a 'user' relationship.
        $subscriptionUser = $subscription->user;
        if ($subscriptionUser) {
            try {
                $subscriptionUser->update(['role' => 'community_member']);
                $subscriptionUser->syncRoles('community_member');
            } catch (\Exception $e) {
                return response()->json([
                    'status'  => 500,
                    'message' => 'Failed to update user role',
                    'error'   => $e->getMessage(),
                ], 500);
            }
        }

        // Get membership plan name; use a default if unavailable.
        $membershipPlanName = $subscription->membershipPlan->PlanName ?? 'N/A';
        // Assume 'membership date' refers to MemberstartDate; adjust if needed.
        $membershipDate = $subscription->MemberstartDate;

        // Construct the notification message.
        $message = "Your subscription {$membershipPlanName} that was subscribed in {$membershipDate} is cancelled.";

        // Create a new subscription notification.
        SubscriptionNotification::create([
            'SubscriptionId' => $subscription->id,
            'Description'    => $message,
            'WatchStatus'    => 'unwatch',
        ]);

        return response()->json([
            'status'  => 200,
            'message' => 'Subscription cancelled successfully',
            'data'    => $subscription,
        ]);
    }

    public function checkUserSubscriptionStatus($userId)
    {
        // Retrieve the latest subscription for the given user ID
        $subscription = Subscription::where('users_id', $userId)
            ->latest('MemberstartDate')
            ->first();

        // If there is no subscription, return false.
        if (! $subscription) {
            return false;
        }

        // Normalize the payment status for case-insensitive comparison.
        $status = strtolower($subscription->PaymentStatus);

        // Return true for "rejected", "resubmit", or "pending" statuses.
        if (in_array($status, ['rejected', 'resubmit', 'pending'])) {
            return true;
        }

        // For an accepted/approved subscription, check the MemberEndDate.
        if ($status === 'approved') {
            $today         = Carbon::now();
            $memberEndDate = Carbon::parse($subscription->MemberEndDate);

            // Calculate the number of days left from today until the subscription end date.
            $daysLeft = $today->lessThanOrEqualTo($memberEndDate)
            ? (int) $today->diffInDays($memberEndDate)
            : 0;

            // If the subscription expires in 7 or fewer days, return true.
            if ($daysLeft <= 7) {
                return true;
            }
        }

        // In all other cases, return false.
        return false;
    }

    public function getSubscriptionDataWithNotifications($id)
    {
        // Retrieve the subscription along with its related data and all notifications.
        $subscription = Subscription::with([
            'user',
            'paymentType',
            'membershipPlan',
            'subscriptionNotifications',
        ])->find($id);

        // Check if the subscription exists.
        if (! $subscription) {
            return response()->json([
                'status'  => 404,
                'message' => 'Subscription not found',
            ], 404);
        }

        // Prepare the data to return.
        $data = [
            'subscription_id'   => $subscription->id,
            'user'              => [
                'id'           => $subscription->user->id ?? null,
                'name'         => $subscription->user->name ?? null,
                'email'        => $subscription->user->email ?? null,
                'phone_number' => $subscription->user->phone_number ?? null,
                'profile_pic'  => $subscription->user->ProfilePic ?? null,
            ],
            'membership_plan'   => $subscription->membershipPlan,
            'payment'           => [
                'payment_type'           => $subscription->paymentType->PaymentTypeName ?? null,
                'payment_screenshot'     => $subscription->PaymentScreenShot,
                'payment_account_name'   => $subscription->PaymentAccountName,
                'payment_account_number' => $subscription->PaymentAccountNumber,
                'payment_date'           => $subscription->PaymentDate,
                'payment_status'         => $subscription->PaymentStatus,
            ],
            'member_start_date' => $subscription->MemberstartDate,
            'member_end_date'   => $subscription->MemberEndDate,
            'admin_id'          => $subscription->admin_id,
            // Map each notification to include description and watch status.
            'notifications'     => $subscription->subscriptionNotifications->map(function ($notification) {
                return [
                    'description'  => $notification->Description,
                    'watch_status' => $notification->WatchStatus,
                ];
            }),
        ];

        return response()->json([
            'status' => 200,
            'data'   => $data,
        ]);
    }


    
}
