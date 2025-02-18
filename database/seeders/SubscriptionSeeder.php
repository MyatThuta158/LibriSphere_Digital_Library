<?php
namespace Database\Seeders;

use Carbon\Carbon;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subscriptions = [];

        for ($i = 1; $i <= 40; $i++) {
            // Random payment date between 2023-01-01 and 2025-12-31
            $paymentDate = Carbon::createFromFormat('Y-m-d', rand(2023, 2025) . '-' . rand(1, 12) . '-' . rand(1, 28));

            // Start date is within 10 days after payment date
            $memberStartDate = $paymentDate->copy()->addDays(rand(1, 10));

            // Membership valid for a year from start date
            $memberEndDate = $memberStartDate->copy()->addYear();

            $faker = Faker::create();

            $subscriptions[] = [
                'admin_id'             => null,
                'membership_plans_id'  => rand(1, 2),
                'payment_types_id'     => rand(1, 2),
                'users_id'             => $i,
                'PaymentScreenShot'    => 'subscriptions/dummy_screenshot.jpg',
                'PaymentAccountName'   => 'User ' . $i,
                'PaymentAccountNumber' => '123456789' . $i,
                'PaymentDate'          => $paymentDate->toDateString(),     // Random payment date
                'MemberstartDate'      => $memberStartDate->toDateString(), // Member start date
                'MemberEndDate'        => $memberEndDate->toDateString(),   // Member end date
                'PaymentStatus'        => 'Pending',
            ];
        }

        DB::table('subscriptions')->insert($subscriptions);
    }
}
