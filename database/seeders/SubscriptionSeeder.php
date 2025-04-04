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

        // Define the time span for the data: January 1, 2024 to March 15, 2025
        $startDate = Carbon::create(2024, 5, 1);
        $endDate   = Carbon::create(2025, 5, 30);
        $totalDays = $startDate->diffInDays($endDate);

        // Total number of subscriptions to be created
        $totalSubscriptions   = 3000;
        $subscriptionsCreated = 0;

                                       // Parameters for a smooth, predictable daily distribution:
                                       // - A fixed baseline and daily increment with zero noise provide a near-perfect linear trend.
                                       // - This results in very high predictability (R² near 1.0).
        $baseCount             = 5;    // Baseline subscriptions per day
        $dailyTrendIncrement   = 0.01; // Very small daily increase for predictability
        $noiseRange            = 0;    // Zero noise for maximum predictability
        $maxDailySubscriptions = 15;   // Upper limit per day

        // Loop over each day in the time span until the total subscriptions are created.
        for ($i = 0; $i <= $totalDays && $subscriptionsCreated < $totalSubscriptions; $i++) {
            $currentDate = $startDate->copy()->addDays($i);
            // Calculate the expected subscription count for the day
            $trendComponent = $dailyTrendIncrement * $i;
            $expectedCount  = $baseCount + $trendComponent;

            // With noiseRange = 0 the noise is always 0.
            $noise      = $faker->randomFloat(1, -$noiseRange, $noiseRange);
            $dailyCount = max(5, round($expectedCount + $noise));
            $dailyCount = min($dailyCount, $maxDailySubscriptions);

            // Adjust if adding dailyCount exceeds the total subscriptions target
            if (($subscriptionsCreated + $dailyCount) > $totalSubscriptions) {
                $dailyCount = $totalSubscriptions - $subscriptionsCreated;
            }

            // Create the subscriptions for the current day
            for ($j = 0; $j < $dailyCount; $j++) {
                Subscription::create([
                    'admin_id'             => $faker->numberBetween(6, 7), // Consistent range
                    'membership_plans_id'  => $faker->numberBetween(7, 9), // Assuming 3 different plans
                    'payment_types_id'     => $faker->numberBetween(1, 2),
                    'users_id'             => $faker->numberBetween(1, 900), // Allow duplicate user IDs
                    'PaymentScreenShot'    => $faker->imageUrl(800, 600, 'business'),
                    'PaymentAccountName'   => $faker->name,
                    'PaymentAccountNumber' => $faker->iban('PH'),
                    'PaymentDate'          => $currentDate->format('Y-m-d'),
                    'MemberstartDate'      => $currentDate->format('Y-m-d'),
                    'MemberEndDate'        => $currentDate->copy()->addMonth()->format('Y-m-d'),
                    'PaymentStatus'        => 'Approved', // All records are approved to ensure consistency
                    'AdminApprovedDate'    => $currentDate->format('Y-m-d'),
                    'SubscriptionStatus'   => 'active',
                ]);
                $subscriptionsCreated++;
            }
        }

        $this->command->info("Successfully created {$subscriptionsCreated} subscriptions between {$startDate->toDateString()} and {$endDate->toDateString()}");
    }
}
