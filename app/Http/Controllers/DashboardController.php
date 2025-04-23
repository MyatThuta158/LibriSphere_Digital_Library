<?php
namespace App\Http\Controllers;

use App\Models\ForumPost;
use App\Models\MembershipPlan;
use App\Models\Request_Resources;
use App\Models\Resources;
use App\Models\SubscriberPrediction;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        // Existing counts
        $pendingSubscriptions = Subscription::where('PaymentStatus', 'pending')->count();
        $totalResources       = Resources::count();
        $pendingBookRequests  = Request_Resources::whereNull('Admin_Comment')
            ->orWhere('Admin_Comment', '')->count();
        $totalUsers    = User::count();
        $subscriptions = Subscription::with(['admin', 'membershipPlan', 'paymentType', 'user'])->get();

        // Top‑10 most‑viewed (optional, if you still want this)
        $topResources = Resources::orderBy('MemberViewCount', 'desc')
            ->take(10)
            ->get(['id', 'name', 'MemberViewCount']);

        // **All** resources sorted highest → lowest by view count
        $allResourcesByViews = Resources::orderBy('MemberViewCount', 'desc')
            ->get(['id', 'name', 'MemberViewCount']);

        return response()->json([
            // Dashboard metrics
            'pendingSubscriptions' => $pendingSubscriptions,
            'totalResources'       => $totalResources,
            'pendingBookRequests'  => $pendingBookRequests,
            'totalUsers'           => $totalUsers,
            'subscriptions'        => $subscriptions,

            // Optional: keep your top‑10 list
            'topResources'         => $topResources,

            // New: full list of resources by descending view‑count
            'allResourcesByViews'  => $allResourcesByViews,
        ], 200);
    }

    public function managerDashboard()
    {
        $librarianCount       = User::role('librarian')->count();
        $totalMembers         = User::count();
        $totalCommunityMember = User::where('role', 'community_member')->count();

        // Current-month revenue (mixed-case column, so we quote it)
        $currentMonthRevenue = Subscription::join('membership_plans', 'subscriptions.membership_plans_id', '=', 'membership_plans.id')
            ->where('PaymentStatus', 'Approved')
            ->whereRaw(
                'EXTRACT(MONTH FROM ("subscriptions"."PaymentDate"::date)) = ?',
                [Carbon::now()->month]
            )
            ->sum('membership_plans.Price');

        $plans        = MembershipPlan::all(['id', 'PlanName']);
        $planRevenues = $plans->map(function ($plan) {
            $base = Subscription::join('membership_plans', 'subscriptions.membership_plans_id', '=', 'membership_plans.id')
                ->where('PaymentStatus', 'Approved')
                ->where('membership_plans_id', $plan->id);

            return [
                'PlanName' => $plan->PlanName,

                // Last 7 days
                '7_days'   => (clone $base)
                    ->whereRaw(
                        '("subscriptions"."PaymentDate"::date) BETWEEN ? AND ?',
                        [
                            Carbon::now()->subDays(7)->toDateString(),
                            Carbon::now()->toDateString(),
                        ]
                    )
                    ->sum('membership_plans.Price'),

                // Last 14 days
                '14_days'  => (clone $base)
                    ->whereRaw(
                        '("subscriptions"."PaymentDate"::date) BETWEEN ? AND ?',
                        [
                            Carbon::now()->subDays(14)->toDateString(),
                            Carbon::now()->toDateString(),
                        ]
                    )
                    ->sum('membership_plans.Price'),

                // Last 28 days
                '28_days'  => (clone $base)
                    ->whereRaw(
                        '("subscriptions"."PaymentDate"::date) BETWEEN ? AND ?',
                        [
                            Carbon::now()->subDays(28)->toDateString(),
                            Carbon::now()->toDateString(),
                        ]
                    )
                    ->sum('membership_plans.Price'),
            ];
        });

        $topForumPosts = ForumPost::with('user')
            ->orderBy('PostViews', 'desc')
            ->limit(10)
            ->get();

        $predictions = SubscriberPrediction::orderBy('PredictedDate', 'desc')
            ->get(['SubscriptionPlanName', 'Accuracy', 'PredictedDate', '7DaysReport', '14DaysReport', '28DaysReport']);

        return response()->json([
            'librarianCount'       => $librarianCount,
            'totalMembers'         => $totalMembers,
            'totalCommunityMember' => $totalCommunityMember,
            'currentMonthRevenue'  => $currentMonthRevenue,
            'planRevenues'         => $planRevenues,
            'topForumPosts'        => $topForumPosts,
            'predictions'          => $predictions,
        ], 200);
    }

}
