<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Spatie\Permission\Models\Role;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $faker = Faker::create();

        // Create roles if they don't exist
        $roles = ['member', 'community_member'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // Define the start and end dates for the period (March 2024 to February 2025)
        $startDate = Carbon::create(2024, 7, 1);
        $endDate = Carbon::create(2025, 2, 28);

        // Generate 50 users within the date range
        $userCount = 0;

        // Repeat until we have 50 users
        while ($userCount < 250 && $startDate <= $endDate) {
            // Create a user with a random creation date within this month
            $user = User::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'password' => Hash::make('password123'),
                'gender' => $faker->randomElement(['male', 'female']),
                'phone_number' => $faker->phoneNumber,
                'DateOfBirth' => $faker->date,
                'role' => 'member', // Can change based on the role you want
                'ProfilePic' => null, // Or generate a random image URL
                'created_at' => $faker->dateTimeBetween($startDate, $startDate->copy()->endOfMonth()), // Random date within the month
                'updated_at' => now(),
            ]);

            // Assign the role to the user
            $role = Role::where('name', 'member')->first(); // Or dynamically choose the role
            if ($role) {
                $user->assignRole($role);
            }

            $userCount++;

            // Move to the next month if less than 50 users have been created
            if ($userCount < 50) {
                $startDate->addMonth();
            }
        }
    }
}
