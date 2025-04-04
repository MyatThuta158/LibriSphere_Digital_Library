<?php
namespace App\Http\Controllers;

use App\Models\Request_Resources;
use App\Models\Resources;
use App\Models\Subscription;
use App\Models\User;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        // Count subscriptions where the status is pending
        $pendingSubscriptions = Subscription::where('SubscriptionStatus', 'pending')->count();

        // Count all electronic resources in the library
        $totalResources = Resources::count();

        // Count book requests that have no admin comment (considered pending)
        $pendingBookRequests = Request_Resources::where(function ($query) {
            $query->whereNull('Admin_Comment')
                ->orWhere('Admin_Comment', '');
        })->count();

        // Count total users
        $totalUsers = User::count();

        // Retrieve all subscription data along with their relationships
        $subscriptions = Subscription::with(['admin', 'membershipPlan', 'paymentType', 'user'])->get();

        // Return all data as a JSON response
        return response()->json([
            'pendingSubscriptions' => $pendingSubscriptions,
            'totalResources'       => $totalResources,
            'pendingBookRequests'  => $pendingBookRequests,
            'totalUsers'           => $totalUsers,
            'subscriptions'        => $subscriptions,
        ]);
    }

}
