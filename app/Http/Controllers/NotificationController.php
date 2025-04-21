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
            })->orderBy('created_at', 'desc')
            ->get();

        // Get all forum post IDs submitted by the authenticated user.
        $forumPostIds = $user->forumPosts()->pluck('ForumPostId');

        // Fetch discussion notifications with NotiStatus 'unwatched'
        // where the ForumPostId is among the user's forum posts.
        $discussionNotifications = Discussion::with('user')
            ->where('NotiStatus', 'unwatched')
            ->whereIn('ForumPostId', $forumPostIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'subscription_notifications' => $subscriptionNotifications,
            'discussion_notifications'   => $discussionNotifications,
        ]);
    }

//---------This is to change discussion noti-----//
    public function markAllNotificationsAsWatched()
    {
        // Ensure the user is authenticated.
        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $user = auth()->user();

        // Update all subscription notifications whose subscription belongs to the user.
        SubscriptionNotification::whereHas('subscription', function ($query) use ($user) {
            $query->where('users_id', $user->id);
        })->update(['WatchStatus' => 'watched']);

        // Get all forum post IDs submitted by the authenticated user.
        $forumPostIds = $user->forumPosts()->pluck('ForumPostId');

        // Update all discussion notifications (with NotiStatus 'unwatched')
        // that are associated with the user's forum posts.
        Discussion::where('NotiStatus', 'unwatched')
            ->whereIn('ForumPostId', $forumPostIds)
            ->update(['NotiStatus' => 'watched']);

        return response()->json(['message' => 'All notifications marked as watched']);
    }

    public function totalCount()
    {
        // 1) Auth check as before
        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $user = auth()->user();

        // 2) Wrap all counting in try/catch
        try {
            $subscriptionCount = SubscriptionNotification::where('WatchStatus', 'unwatch')
                ->whereHas('subscription', function ($query) use ($user) {
                    $query->where('users_id', $user->id);
                })
                ->count();

            $forumPostIds = $user->forumPosts()->pluck('ForumPostId')->toArray();

            $discussionCount = Discussion::where('NotiStatus', 'unwatched')
                ->whereIn('ForumPostId', $forumPostIds)
                ->count();

            $totalNotifications = $subscriptionCount + $discussionCount;
        } catch (\Exception $e) {
            // on any error, default to zero
            \Log::warning('totalCount failed: ' . $e->getMessage());
            $totalNotifications = 0;
        }

        // 3) Always return 200
        return response()->json([
            'total_notifications' => $totalNotifications,
        ], 200);
    }

}
