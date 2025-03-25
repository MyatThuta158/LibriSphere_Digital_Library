<?php
namespace Database\Seeders;

use App\Models\Announcement;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Retrieve a user with the 'manager' role.
        // $manager = User::whereHas('roles', function ($query) {
        //     $query->where('name', 'manager');
        // })->first();

        // If no manager is found, create one.
        // if (! $manager) {
        //     $manager = User::factory()->create([
        //         'name'     => 'Manager User',
        //         'email'    => 'manager@example.com',
        //         'password' => bcrypt('password'), // adjust as needed
        //     ]);
        //     $manager->assignRole('manager');
        // }

        // Initialize Faker for generating dummy data.
        $faker = Faker::create();

        // Create at least 10 announcements.
        for ($i = 0; $i < 10; $i++) {
            Announcement::create([
                'title'       => $faker->sentence(6),  // Generates a sentence with 6 words.
                'description' => $faker->paragraph(3), // Generates a paragraph with 3 sentences.
                'admin_id'    => 2,
            ]);
        }
    }
}
