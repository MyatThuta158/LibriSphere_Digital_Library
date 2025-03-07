<?php
namespace App\Http\Controllers;

use App\Models\ForumPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class ForumPostController extends Controller
{

    /**
     * Display a listing of the forum posts.
     */
    public function index(Request $request)
    {
        try {
            // Define the number of posts per page (default is 10)
            $limit = $request->input('limit', 10);

            // Retrieve posts ordered by creation date (latest first) with pagination
            $posts = ForumPost::with('User')->orderBy('created_at', 'desc')->paginate($limit);

            return response()->json([
                'success' => true,
                'data'    => $posts,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        ob_clean();
        try {
            // Validate request data
            $validated = $request->validate([
                'UserId'      => 'required|integer',
                'Title'       => 'required|string|max:255',
                'Description' => 'required|string',
                'Photo1'      => 'nullable|image',
                'Photo2'      => 'nullable|image',
                'Photo3'      => 'nullable|image',

            ]);

            // Handle file uploads for photos and file using the public disk
            $photo1Path = null;
            if ($request->hasFile('Photo1')) {
                $photo1     = $request->file('Photo1');
                $photo1Path = $photo1->store('posts', 'public');
            }

            $photo2Path = null;
            if ($request->hasFile('Photo2')) {
                $photo2     = $request->file('Photo2');
                $photo2Path = $photo2->store('posts', 'public');
            }

            $photo3Path = null;
            if ($request->hasFile('Photo3')) {
                $photo3     = $request->file('Photo3');
                $photo3Path = $photo3->store('posts', 'public');
            }

            // Create the forum post record
            $forumPost = ForumPost::create([
                'UserId'      => $validated['UserId'],
                'Title'       => $validated['Title'],
                'Description' => $validated['Description'],
                'Photo1'      => $photo1Path,
                'Photo2'      => $photo2Path,
                'Photo3'      => $photo3Path,
                'PostViews'   => 0,
            ]);

            return Response::json(['success' => true, 'data' => $forumPost], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ForumPost $forumPost)
    {
        try {
            // Validate request data (all fields are optional for partial update)
            $validated = $request->validate([
                'Title'       => 'sometimes|required|string|max:255',
                'Description' => 'sometimes|required|string',
                'Photo1'      => 'nullable|image',
                'Photo2'      => 'nullable|image',
                'Photo3'      => 'nullable|image',

            ]);

            // Update title and description if provided
            if (isset($validated['Title'])) {
                $forumPost->Title = $validated['Title'];
            }
            if (isset($validated['Description'])) {
                $forumPost->Description = $validated['Description'];
            }

            // For each photo and file field:
            // If a new file is provided, delete the existing file from storage and update with the new file.
            // If not provided, keep the current file name.

            // Photo1
            if ($request->hasFile('Photo1')) {
                if ($forumPost->Photo1 && Storage::exists($forumPost->Photo1)) {
                    Storage::delete($forumPost->Photo1);
                }
                $forumPost->Photo1 = $request->file('Photo1')->store('posts');
            }

            // Photo2
            if ($request->hasFile('Photo2')) {
                if ($forumPost->Photo2 && Storage::exists($forumPost->Photo2)) {
                    Storage::delete($forumPost->Photo2);
                }
                $forumPost->Photo2 = $request->file('Photo2')->store('posts');
            }

            // Photo3
            if ($request->hasFile('Photo3')) {
                if ($forumPost->Photo3 && Storage::exists($forumPost->Photo3)) {
                    Storage::delete($forumPost->Photo3);
                }
                $forumPost->Photo3 = $request->file('Photo3')->store('posts');
            }

            $forumPost->save();

            return response()->json(['success' => true, 'data' => $forumPost], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //----This is for single post show
    public function show($id)
    {
        try {
            // Find the post by ID and include user data
            $post = ForumPost::with('user')->findOrFail($id);

            // Increment the 'views' column by 1
            $post->increment('PostViews');

            return response()->json([
                'status'  => 200,
                'data'    => $post,
                'user_id' => $post->user_id, // Retrieve the user_id
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'error'  => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ForumPost $forumPost)
    {
        try {
            // Delete associated files if they exist
            if ($forumPost->Photo1 && Storage::exists($forumPost->Photo1)) {
                Storage::delete($forumPost->Photo1);
            }
            if ($forumPost->Photo2 && Storage::exists($forumPost->Photo2)) {
                Storage::delete($forumPost->Photo2);
            }
            if ($forumPost->Photo3 && Storage::exists($forumPost->Photo3)) {
                Storage::delete($forumPost->Photo3);
            }
            if ($forumPost->File && Storage::exists($forumPost->File)) {
                Storage::delete($forumPost->File);
            }

            $forumPost->delete();

            return response()->json(['success' => true, 'message' => 'Forum post deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function userPosts($id)
    {
        try {
            // Validate that the ID is an integer
            if (! is_numeric($id)) {
                return response()->json(['success' => false, 'error' => 'Invalid user ID.'], 400);
            }

            // Retrieve posts that belong to the given user ID, ordered by creation date
            $posts = ForumPost::with('user')
                ->where('UserId', $id)
                ->orderBy('created_at', 'desc')
                ->get();

            // Check if the user has any posts
            if ($posts->isEmpty()) {
                return Response::json(['success' => false, 'message' => 'No posts found for this user.'], 404);
            }

            return response()->json(['success' => true, 'data' => $posts], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    //-----------This is the report section-----//
    public function multiIntervalReport(Request $request)
    {
        try {
            // Optional filter: allow filtering by user id.
            $userId = $request->input('user_id');

            // Define the intervals in days. Replace 90 with 60.
            $intervals = [7, 14, 28, 60];
            $reports   = [];

            foreach ($intervals as $days) {
                // Calculate the start date for the interval.
                $startDate = \Carbon\Carbon::now()->subDays($days - 1)->startOfDay();
                $endDate   = \Carbon\Carbon::now()->endOfDay();

                // Build the query with optional user filter and date range.
                $query = ForumPost::query();
                if ($userId) {
                    $query->where('UserId', $userId);
                }
                $query->whereBetween('created_at', [$startDate, $endDate]);

                // Aggregate total views per day using quoted column name.
                $result = $query->selectRaw('DATE(created_at) as date, SUM("PostViews") as total_views')
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();

                // Prepare a daily report ensuring every day is represented.
                $dailyReport = [];
                for ($i = 0; $i < $days; $i++) {
                    $date = \Carbon\Carbon::now()->subDays($days - 1 - $i)->toDateString();
                    // Find record for the current date, if any.
                    $record = $result->first(function ($item) use ($date) {
                        return $item->date == $date;
                    });

                    $dailyReport[] = [
                        'date'        => $date,
                        'total_views' => $record ? $record->total_views : 0,
                    ];
                }

                // Save the report for the current interval.
                $reports["{$days}_days"] = $dailyReport;
            }

            return response()->json([
                'success' => true,
                'data'    => $reports,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    //-----------This is the sum of total user engagement report----///
    public function totalUserEngagement(Request $request)
    {
        try {
            // Optional: filter by a specific user ID.
            $userId = $request->input('user_id');

            // Define the intervals in days.
            $intervals = [7, 14, 28, 60];
            $results   = [];

            foreach ($intervals as $days) {
                // Calculate the start and end date for the interval.
                $startDate = \Carbon\Carbon::now()->subDays($days - 1)->startOfDay();
                $endDate   = \Carbon\Carbon::now()->endOfDay();

                // Build the query with an optional user filter.
                $query = ForumPost::query();
                if ($userId) {
                    $query->where('UserId', $userId);
                }
                $query->whereBetween('created_at', [$startDate, $endDate]);

                // Aggregate the total views and count total posts.
                $aggregates = $query->selectRaw('SUM("PostViews") as total_views, COUNT(*) as total_posts')->first();

                $results["{$days}_days"] = [
                    'total_views' => (int) $aggregates->total_views,
                    'total_posts' => (int) $aggregates->total_posts,
                ];
            }

            return response()->json([
                'success' => true,
                'data'    => $results,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
