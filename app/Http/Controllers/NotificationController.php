<?php
namespace App\Http\Controllers;

use App\Models\Discussion;
use App\Models\SubscriptionNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Fetch notifications for the authenticated user.
     *
     * Retrieves:
     * - Subscription notifications (with their related subscription details, including status)
     *   by filtering via the subscription's users_id field.
     * - Discussions with NotiStatus of 'unwatched' where the related forum post belongs to the user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Ensure the user is authenticated.
        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = auth()->user();

        // Fetch subscription notifications along with the related subscription
        // This allows you to access subscription details such as the subscription status.
        $subscriptionNotifications = SubscriptionNotification::with('subscription')
            ->whereHas('subscription', function ($query) use ($user) {
                $query->where('users_id', $user->id);
            })->get();

        // Get all forum post IDs submitted by the authenticated user.
        $forumPostIds = $user->forumPosts()->pluck('ForumPostId');

        // Fetch discussion notifications with NotiStatus 'unwatched'
        // where the ForumPostId is among the user's forum posts.
        $discussionNotifications = Discussion::with('user')
            ->where('NotiStatus', 'unwatched')
            ->whereIn('ForumPostId', $forumPostIds)
            ->get();

        return response()->json([
            'subscription_notifications' => $subscriptionNotifications,
            'discussion_notifications'   => $discussionNotifications,
        ]);
    }
}
