<?php
namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class MemberSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Create roles if they don't exist
        $roles = ['member', 'community_member'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Define date range: October 1, 2024 to March 14, 2025 (6 months)
        $startDate = Carbon::create(2024, 10, 1);
        $endDate   = Carbon::create(2025, 3, 14);
        $totalDays = $startDate->diffInDays($endDate);

                                     // Parameters to simulate signups with a realistic pattern
        $baseCount           = 2;    // Base daily signups
        $dailyTrendIncrement = 0.15; // Growth factor per day
        $weekendBoost        = 4;    // Additional signups on weekends (Saturday/Sunday)
        $noiseRange          = 1;    // Random variation
        $maxDailyUsers       = 10;   // Maximum signups per day (saturation)
        $totalUsers          = 0;

        // Loop through each day in the date range
        for ($i = 0; $i <= $totalDays; $i++) {
            $currentDate = $startDate->copy()->addDays($i);
            $dayOfWeek   = $currentDate->dayOfWeek;

            // Calculate a trend component with logistic growth to simulate saturation
            $trendComponent = $dailyTrendIncrement * $i * (1 - ($i / $totalDays));

            // Weekend seasonality: boost signups on Saturday (6) and Sunday (0)
            $seasonalComponent = in_array($dayOfWeek, [0, 6]) ? $weekendBoost : 0;

            // Compute the expected signup count and enforce a daily maximum
            $expectedCount = $baseCount + $trendComponent + $seasonalComponent;
            $expectedCount = min($expectedCount, $maxDailyUsers);

            // Add some random noise
            $noise          = rand(-$noiseRange, $noiseRange);
            $dailyUserCount = max(1, round($expectedCount + $noise));

            // Cap the overall user count to a total (here keeping under 950 users)
            if (($totalUsers + $dailyUserCount) > 950) {
                $dailyUserCount = max(0, 950 - $totalUsers);
            }
            $totalUsers += $dailyUserCount;

            // Create each user for the day with a random assigned role
            for ($j = 0; $j < $dailyUserCount; $j++) {
                $assignedRole = $faker->randomElement($roles);

                User::create([
                    'name'         => $faker->name,
                    'email'        => $faker->unique()->safeEmail,
                    'password'     => Hash::make('password123'),
                    'gender'       => $faker->randomElement(['male', 'female']),
                    'phone_number' => $faker->phoneNumber,
                    'DateOfBirth'  => $faker->date(),
                    'role'         => $assignedRole,
                    'ProfilePic'   => null,
                    'created_at'   => $currentDate->toDateString(),
                    'updated_at'   => $currentDate->toDateString(),
                ])->assignRole($assignedRole);
            }
        }
    }
}
