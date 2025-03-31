<?php
namespace Database\Seeders;

use App\Models\Subscription;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Define the timeline: June 1, 2024 to March 15, 2025
        $startDate = Carbon::create(2024, 6, 1);
        $endDate   = Carbon::create(2025, 3, 15);
        $totalDays = $startDate->diffInDays($endDate);

        $totalSubscriptions   = 500;
        $subscriptionsCreated = 0;

                                      // Parameters for the trend simulation
        $baseCount           = 1;     // Base subscriptions per day
        $dailyTrendIncrement = 0.005; // Trend growth factor per day
        $weekendBoost        = 0.5;   // Additional subscriptions on weekends (Saturday/Sunday)
        $noiseRange          = 0.2;   // Random variation range (+/-)

        // Loop over each day in the timeline until 500 subscriptions are created
        for ($i = 0; $i <= $totalDays && $subscriptionsCreated < $totalSubscriptions; $i++) {
            $currentDate = $startDate->copy()->addDays($i);
            $dayOfWeek   = $currentDate->dayOfWeek; // Sunday = 0, Saturday = 6

            // Trend component with a logistic-like adjustment (grows then saturates)
            $trendComponent = $dailyTrendIncrement * $i * (1 - ($i / $totalDays));
            // Weekend seasonality: add boost on Saturday and Sunday
            $seasonalComponent = in_array($dayOfWeek, [0, 6]) ? $weekendBoost : 0;

            // Expected daily subscriptions based on trend and seasonality
            $expectedCount = $baseCount + $trendComponent + $seasonalComponent;
            // Add some random noise
            $noise      = $faker->randomFloat(1, -$noiseRange, $noiseRange);
            $dailyCount = max(0, round($expectedCount + $noise));

            // Ensure at least one record per day if there are still subscriptions to create
            if ($dailyCount < 1 && ($totalSubscriptions - $subscriptionsCreated) > 0) {
                $dailyCount = 1;
            }
            // Do not exceed the total of 500 subscriptions
            if (($subscriptionsCreated + $dailyCount) > $totalSubscriptions) {
                $dailyCount = $totalSubscriptions - $subscriptionsCreated;
            }

            // Create each subscription for the day
            for ($j = 0; $j < $dailyCount; $j++) {
                // 70% chance of an approved payment; otherwise, mark as rejected.
                $isApproved         = $faker->boolean(70);
                $paymentStatus      = $isApproved ? 'approved' : 'rejected';
                $subscriptionStatus = $isApproved ? 'active' : 'inactive';

                // If approved, generate a payment screenshot URL; if rejected, set to null.
                $paymentScreenShot = $faker->imageUrl(640, 480, 'business', true);

                // PaymentDate is set to the current date of simulation.
                $paymentDate = $currentDate->toDateString();

                // For approved subscriptions, set membership start/end dates (here, one month subscription period).
                // if ($isApproved) {
                //     $memberStartDate = $paymentDate;
                //     $memberEndDate   = $currentDate->copy()->addMonth()->toDateString();
                // } else {
                //     $memberStartDate = null;
                //     $memberEndDate   = null;
                // }

                $memberStartDate = $paymentDate;
                $memberEndDate   = $currentDate->copy()->addMonth()->toDateString();

                Subscription::create([
                    'admin_id'             => $faker->numberBetween(6, 7),
                    'membership_plans_id'  => $faker->numberBetween(1, 2),
                    'payment_types_id'     => $faker->numberBetween(1, 2),
                    'users_id'             => $faker->numberBetween(1, 500),
                    'PaymentScreenShot'    => $paymentScreenShot,
                    'PaymentAccountName'   => $faker->name,
                    'PaymentAccountNumber' => $faker->bankAccountNumber,
                    'PaymentDate'          => $paymentDate,
                    'MemberstartDate'      => $memberStartDate,
                    'MemberEndDate'        => $memberEndDate,
                    'PaymentStatus'        => $paymentStatus,
                    'SubscriptionStatus'   => $subscriptionStatus,
                ]);

                $subscriptionsCreated++;
            }
        }
    }
}
