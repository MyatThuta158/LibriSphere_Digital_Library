<?php
namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{

    //-----------This is the report for new member-----///
    public function getNewMembersReport(Request $request)
    {
        $period = $request->query('period', '12_months'); // Default period
        $data   = [];

        switch ($period) {

            // ------ Last 7 Days ------
            case '7_days':
                $labels = [];
                $counts = [];
                // Loop for the last 7 days (oldest first)
                for ($i = 6; $i >= 0; $i--) {
                    $date     = Carbon::now()->subDays($i);
                    $labels[] = $date->format('Y-m-d');
                    // Although count() returns 0 when no records are found,
                    // we force it to 0 explicitly if needed.
                    $counts[] = (User::whereDate('created_at', $date->format('Y-m-d'))->count()) ?
                    User::whereDate('created_at', $date->format('Y-m-d'))->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;

            // ------ Last 14 Days ------
            case '14_days':
                $labels = [];
                $counts = [];
                for ($i = 13; $i >= 0; $i--) {
                    $date     = Carbon::now()->subDays($i);
                    $labels[] = $date->format('Y-m-d');
                    $counts[] = (User::whereDate('created_at', $date->format('Y-m-d'))->count()) ?
                    User::whereDate('created_at', $date->format('Y-m-d'))->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;

            // ------ Last 28 Days ------
            case '28_days':
                $labels = [];
                $counts = [];
                for ($i = 27; $i >= 0; $i--) {
                    $date     = Carbon::now()->subDays($i);
                    $labels[] = $date->format('Y-m-d');
                    $counts[] = (User::whereDate('created_at', $date->format('Y-m-d'))->count()) ?
                    User::whereDate('created_at', $date->format('Y-m-d'))->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;

            // ------ Yearly Report ------
            case 'yearly':
                // Expect a 'year' parameter (e.g., ?year=2025)
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 400);
                }
                $year   = $request->query('year');
                $labels = [];
                $counts = [];
                // Loop through each month of the specified year
                for ($month = 1; $month <= 12; $month++) {
                    $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
                    $endDate   = Carbon::createFromDate($year, $month, 1)->endOfMonth();
                    $labels[]  = $startDate->format('F'); // Full month name
                    $counts[]  = (User::whereBetween('created_at', [$startDate, $endDate])->count()) ?
                    User::whereBetween('created_at', [$startDate, $endDate])->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;

            // ------ Monthly Report (Daily breakdown for a specific month) ------
            case 'monthly':
                $year   = $request->query('year', Carbon::now()->year);
                $month  = $request->query('month', Carbon::now()->month);
                $labels = [];
                $counts = [];
                // Get number of days in the specified month
                $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $date     = Carbon::createFromDate($year, $month, $day);
                    $labels[] = $date->format('Y-m-d');
                    $counts[] = (User::whereDate('created_at', $date->format('Y-m-d'))->count()) ?
                    User::whereDate('created_at', $date->format('Y-m-d'))->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;

            // ------ Default: Last 12 Months ------
            default:
                $labels = [];
                $counts = [];
                for ($i = 11; $i >= 0; $i--) {
                    $startDate = Carbon::now()->subMonths($i)->startOfMonth();
                    $endDate   = Carbon::now()->subMonths($i)->endOfMonth();
                    $labels[]  = $startDate->format('F Y');
                    $counts[]  = (User::whereBetween('created_at', [$startDate, $endDate])->count()) ?
                    User::whereBetween('created_at', [$startDate, $endDate])->count() : 0;
                }
                $data = [
                    'labels' => $labels,
                    'counts' => $counts,
                ];
                break;
        }

        // Return the data as a JSON response
        return response()->json($data);
    }

    //----------- This is the report for membership plan-----------//
    public function membershipPlanReport(Request $request)
    {
        // Get the period from the query string; default to '12_months'
        $period  = $request->query('period', '12_months');
        $grouped = []; // This will hold our final grouped data

        // ----- Daily Breakdown Cases (7_days, 14_days, 28_days, monthly) -----
        if (in_array($period, ['7_days', '14_days', '28_days', 'monthly'])) {
            // Determine the date range based on the period.
            if ($period === '7_days') {
                $startDate = Carbon::now()->subDays(6)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '14_days') {
                $startDate = Carbon::now()->subDays(13)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '28_days') {
                $startDate = Carbon::now()->subDays(27)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === 'monthly') {
                // For a monthly (daily breakdown) report, pass the desired year and month.
                $year      = $request->query('year', Carbon::now()->year);
                $month     = $request->query('month', Carbon::now()->month);
                $startDate = Carbon::createFromDate($year, $month, 0)->startOfDay();

                $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();

                // dd($startDate);
            }

            // Retrieve subscriptions grouped by PaymentDate and PlanName.
            $subscription = Subscription::selectRaw('
                    "membership_plans"."PlanName",
                    "subscriptions"."PaymentDate",
                    COUNT("subscriptions"."id") as total
                ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    'subscriptions.PaymentDate',
                    DB::raw('"membership_plans"."PlanName"')
                )
                ->orderBy('subscriptions.PaymentDate', 'asc')
                ->get();

            // dd($subscription);

            // Create a baseline array covering every day in the period.
            // Each entry includes PaymentDate, and empty arrays for planNames and total.
            $dates = [];
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $key         = $date->format('Y-m-d');
                $dates[$key] = [
                    'PaymentDate' => $key,
                    'planNames'   => [],
                    'total'       => [],
                ];
            }

            // Map each query result into the baseline array.
            foreach ($subscription as $record) {
                $dateKey                        = Carbon::parse($record->PaymentDate)->format('Y-m-d');
                $dates[$dateKey]['planNames'][] = $record->PlanName;
                $dates[$dateKey]['total'][]     = $record->total;
            }

            // Re-index the array numerically.
            $grouped = array_values($dates);
        }
        // ----- Monthly Breakdown Cases (yearly and default 12_months) -----
        elseif (in_array($period, ['yearly', '12_months'])) {
            // Determine the date range.
            if ($period === 'yearly') {
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 400);
                }
                $year      = $request->query('year');
                $startDate = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $endDate   = Carbon::createFromDate($year, 12, 31)->endOfDay();
            } else {
                // Default case: Last 12 months.
                $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                $endDate   = Carbon::now()->endOfMonth();
            }

            $subscription = Subscription::selectRaw('
            "membership_plans"."PlanName",
            to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\') as PaymentMonth,
            COUNT("subscriptions"."id") as total
        ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'),
                    'membership_plans.PlanName'
                )
                ->orderBy(DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'), 'asc')
                ->get();

            //dd($subscription);

            $months = [];
            for ($date = $startDate->copy()->startOfMonth(); $date->lte($endDate); $date->addMonth()) {
                $key          = $date->format('Y-m'); // e.g., "2025-03"
                $months[$key] = [
                    'PaymentMonth' => $key,
                    'planNames'    => [],
                    'total'        => [],
                ];
            }

            foreach ($subscription as $record) {
                $key = $record->paymentmonth;

                //dd($key);
                if (isset($months[$key])) {
                    $months[$key]['planNames'][] = $record->PlanName;
                    $months[$key]['total'][]     = $record->total;
                }
            }

            // Optionally re-index the array numerically if that suits your API response.
            $grouped = array_values($months);

            return response()->json($grouped);
        }

        // Return the final JSON response.
        return response()->json(
            $grouped,
        );
    }

    //----------This is the total revenue report for each membership plan-----------//
    public function membershipRevenueReport(Request $request)
    {
        $period  = $request->query('period', '12_months');
        $grouped = []; // This will hold our final grouped data

        // ----- Daily Breakdown Cases (7_days, 14_days, 28_days, monthly) -----
        if (in_array($period, ['7_days', '14_days', '28_days', 'monthly'])) {
            // Determine the date range based on the period.
            if ($period === '7_days') {
                $startDate = Carbon::now()->subDays(6)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '14_days') {
                $startDate = Carbon::now()->subDays(13)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '28_days') {
                $startDate = Carbon::now()->subDays(27)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === 'monthly') {
                // For a monthly (daily breakdown) report, pass the desired year and month.
                $year      = $request->query('year', Carbon::now()->year);
                $month     = $request->query('month', Carbon::now()->month);
                $startDate = Carbon::createFromDate($year, $month, 0)->startOfDay();

                $endDate = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();

                // dd($startDate);
            }

            // Retrieve subscriptions grouped by PaymentDate and PlanName.
            $subscription = Subscription::selectRaw('
                    "membership_plans"."PlanName",
                    "membership_plans"."Price",
                    "subscriptions"."PaymentDate",
                    COUNT("subscriptions"."id") as total
                ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    'subscriptions.PaymentDate',
                    DB::raw('"membership_plans"."PlanName"'),
                    DB::raw('"membership_plans"."Price"')
                )
                ->orderBy('subscriptions.PaymentDate', 'asc')
                ->get();

            // dd($subscription);

            // Create a baseline array covering every day in the period.
            // Each entry includes PaymentDate, and empty arrays for planNames and total.
            $dates = [];
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $key         = $date->format('Y-m-d');
                $dates[$key] = [
                    'PaymentDate' => $key,
                    'planNames'   => [],
                    'total'       => [],
                ];
            }

            // Map each query result into the baseline array.
            foreach ($subscription as $record) {
                $dateKey                        = Carbon::parse($record->PaymentDate)->format('Y-m-d');
                $dates[$dateKey]['planNames'][] = $record->PlanName;
                $dates[$dateKey]['total'][]     = $record->total * $record->Price;

                // dd($record->Price);
            }

            // Re-index the array numerically.
            $grouped = array_values($dates);
        }
        // ----- Monthly Breakdown Cases (yearly and default 12_months) -----
        elseif (in_array($period, ['yearly', '12_months'])) {
            // Determine the date range.
            if ($period === 'yearly') {
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 400);
                }
                $year      = $request->query('year');
                $startDate = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $endDate   = Carbon::createFromDate($year, 12, 31)->endOfDay();
            } else {
                // Default case: Last 12 months.
                $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                $endDate   = Carbon::now()->endOfMonth();
            }

            $subscription = Subscription::selectRaw('
            "membership_plans"."PlanName",
            to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\') as PaymentMonth,
            "membership_plans"."Price",
            COUNT("subscriptions"."id") as total
        ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'),
                    'membership_plans.PlanName',
                    DB::raw('"membership_plans"."Price"')
                )
                ->orderBy(DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'), 'asc')
                ->get();

            //dd($subscription);

            $months = [];
            for ($date = $startDate->copy()->startOfMonth(); $date->lte($endDate); $date->addMonth()) {
                $key          = $date->format('Y-m'); // e.g., "2025-03"
                $months[$key] = [
                    'PaymentMonth' => $key,
                    'planNames'    => [],
                    'total'        => [],
                ];
            }

            foreach ($subscription as $record) {
                $key = $record->paymentmonth;

                //dd($key);
                if (isset($months[$key])) {
                    $months[$key]['planNames'][] = $record->PlanName;
                    //$months[$key]['total'][]     = $record->total;
                    $months[$key]['total'][] = $record->total * $record->Price;
                }
            }

            // Optionally re-index the array numerically if that suits your API response.
            $grouped = array_values($months);

            return response()->json($grouped);
        }

        // Return the final JSON response.
        return response()->json(
            $grouped,
        );
    }

    //--------This is for total revenue report---------///
    public function totalRevenueReport(Request $request)
    {
        $period  = $request->query('period', '12_months');
        $grouped = []; // This will hold our final grouped data

        // ----- Daily Breakdown Cases (7_days, 14_days, 28_days, monthly) -----
        if (in_array($period, ['7_days', '14_days', '28_days', 'monthly'])) {
            // Determine the date range based on the period.
            if ($period === '7_days') {
                $startDate = Carbon::now()->subDays(6)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '14_days') {
                $startDate = Carbon::now()->subDays(13)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === '28_days') {
                $startDate = Carbon::now()->subDays(27)->startOfDay();
                $endDate   = Carbon::now()->endOfDay();
            } elseif ($period === 'monthly') {
                // For a monthly (daily breakdown) report, pass the desired year and month.
                $year  = $request->query('year', Carbon::now()->year);
                $month = $request->query('month', Carbon::now()->month);
                // Use day 1 instead of 0 for a valid date.
                $startDate = Carbon::createFromDate($year, $month, 1)->startOfDay();
                $endDate   = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();
            }

            // Retrieve subscriptions grouped by PaymentDate and PlanName.
            $subscription = Subscription::selectRaw('
                    "membership_plans"."PlanName",
                    "membership_plans"."Price",
                    "subscriptions"."PaymentDate",
                    COUNT("subscriptions"."id") as total
                ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    'subscriptions.PaymentDate',
                    DB::raw('"membership_plans"."PlanName"'),
                    DB::raw('"membership_plans"."Price"')
                )
                ->orderBy('subscriptions.PaymentDate', 'asc')
                ->get();

            // Create a baseline array covering every day in the period.
            // Each entry includes PaymentDate, an empty array for planNames, and a total of 0.
            $dates = [];
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                $key         = $date->format('Y-m-d');
                $dates[$key] = [
                    'PaymentDate' => $key,
                    'planNames'   => [],
                    'total'       => 0,
                ];
            }

            // For each subscription record, add its revenue to the corresponding day.
            foreach ($subscription as $record) {
                $dateKey = Carbon::parse($record->PaymentDate)->format('Y-m-d');
                // Append the plan name (if you wish to list all plans for that day)
                $dates[$dateKey]['planNames'][] = $record->PlanName;

                // Calculate the revenue for the current record.
                $revenue = $record->total * $record->Price;
                // Add this revenue only to the current day's total.
                $dates[$dateKey]['total'] += $revenue;
            }

            // Re-index the array numerically.
            $grouped = array_values($dates);
        }
        // ----- Monthly Breakdown Cases (yearly and default 12_months) -----
        elseif (in_array($period, ['yearly', '12_months'])) {
            // Determine the date range.
            if ($period === 'yearly') {
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 400);
                }
                $year      = $request->query('year');
                $startDate = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $endDate   = Carbon::createFromDate($year, 12, 31)->endOfDay();
            } else {
                // Default case: Last 12 months.
                $startDate = Carbon::now()->subMonths(11)->startOfMonth();
                $endDate   = Carbon::now()->endOfMonth();
            }

            $subscription = Subscription::selectRaw('
                "membership_plans"."PlanName",
                to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\') as PaymentMonth,
                "membership_plans"."Price",
                COUNT("subscriptions"."id") as total
            ')
                ->join('membership_plans', 'membership_plans.id', '=', 'subscriptions.membership_plans_id')
                ->whereBetween('subscriptions.PaymentDate', [$startDate, $endDate])
                ->groupBy(
                    DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'),
                    'membership_plans.PlanName',
                    DB::raw('"membership_plans"."Price"')
                )
                ->orderBy(DB::raw('to_char("subscriptions"."PaymentDate"::timestamp, \'YYYY-MM\')'), 'asc')
                ->get();

            // Create a baseline array covering each month in the period.
            $months = [];
            for ($date = $startDate->copy()->startOfMonth(); $date->lte($endDate); $date->addMonth()) {
                $key          = $date->format('Y-m'); // e.g., "2025-03"
                $months[$key] = [
                    'PaymentMonth' => $key,
                    'planNames'    => [],
                    'total'        => 0,
                ];
            }

            // For each subscription record, add its revenue to the corresponding month.
            foreach ($subscription as $record) {
                $key = $record->paymentmonth;
                if (isset($months[$key])) {
                    $months[$key]['planNames'][] = $record->PlanName;
                    $revenue                     = $record->total * $record->Price;
                    $months[$key]['total'] += $revenue;
                }
            }

            // Re-index the array numerically.
            $grouped = array_values($months);

            return response()->json($grouped);
        }

        // Return the final JSON response.
        return response()->json($grouped);
    }

    //-----This is the subscription table report----//
    public function subscriptionTableReport(Request $request)
    {
        // 1) Validate period
        $allowed = ['7_days', '14_days', '28_days', 'monthly', 'yearly'];
        $period  = $request->query('period', '7_days');
        if (! in_array($period, $allowed)) {
            return response()->json([
                'error' => "Invalid period “{$period}”. Use: " . implode(', ', $allowed),
            ], 422);
        }

        // 2) Determine date range
        switch ($period) {
            case '7_days':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case '14_days':
                $start = Carbon::now()->subDays(13)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case '28_days':
                $start = Carbon::now()->subDays(27)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case 'monthly':
                // allow passing ?year=2025&month=4 for historic months
                $year  = $request->query('year', Carbon::now()->year);
                $month = $request->query('month', Carbon::now()->month);
                $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
                $end   = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();
                break;
            case 'yearly':
                // require a ?year=2025 parameter
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 422);
                }
                $year  = $request->query('year');
                $start = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $end   = Carbon::createFromDate($year, 12, 31)->endOfDay();
                break;
        }

        // 3) Fetch paginated subscriptions
        $perPage = $request->query('per_page', 10);

        $subscriptions = Subscription::with(['user', 'membershipPlan', 'paymentType'])
            ->whereBetween('PaymentDate', [$start, $end])
            ->where('PaymentStatus', '=', 'Approved')
            ->orderBy('PaymentDate', 'desc')
            ->paginate($perPage);

        // 4) Return JSON (includes data + pagination meta)
        return response()->json($subscriptions);
    }

    public function userTableReport(Request $request)
    {
        // 1) Validate period
        $allowed = ['7_days', '14_days', '28_days', 'monthly', 'yearly'];
        $period  = $request->query('period', '7_days');
        if (! in_array($period, $allowed)) {
            return response()->json([
                'error' => "Invalid period “{$period}”. Use: " . implode(', ', $allowed),
            ], 422);
        }

        // 2) Determine date range
        switch ($period) {
            case '7_days':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case '14_days':
                $start = Carbon::now()->subDays(13)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case '28_days':
                $start = Carbon::now()->subDays(27)->startOfDay();
                $end   = Carbon::now()->endOfDay();
                break;
            case 'monthly':
                $year  = $request->query('year', Carbon::now()->year);
                $month = $request->query('month', Carbon::now()->month);
                $start = Carbon::createFromDate($year, $month, 1)->startOfDay();
                $end   = Carbon::createFromDate($year, $month, 1)->endOfMonth()->endOfDay();
                break;
            case 'yearly':
                if (! $request->has('year')) {
                    return response()->json([
                        'error' => 'Year parameter is required for yearly reports.',
                    ], 422);
                }
                $year  = $request->query('year');
                $start = Carbon::createFromDate($year, 1, 1)->startOfDay();
                $end   = Carbon::createFromDate($year, 12, 31)->endOfDay();
                break;
        }

        // 3) Fetch paginated users
        $perPage = $request->query('per_page', 10);

        $users = User::with([
            'subscriptions',
            'reviews',
            'forumPosts',
            'discussions',
            'votes',
        ])
            ->whereBetween('created_at', [$start, $end])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // 4) Return JSON
        return response()->json($users);
    }

}
