<?php
namespace Database\Seeders;

use App\Models\ForumPost;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class ForumPosts extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Retrieve all user IDs from the 'users' table
        $userIds = User::pluck('id')->toArray();

        // If no users exist, create a default user
        if (empty($userIds)) {
            $defaultUser = User::factory()->create();
            $userIds[]   = $defaultUser->id;
        }

        // Create 50 fake forum posts
        for ($i = 0; $i < 50; $i++) {
            ForumPost::create([
                'UserId'      => $faker->randomElement($userIds),
                'Title'       => $faker->sentence(6),
                'Description' => $faker->paragraph(4),
                // 70% chance to generate a photo path for Photo1, otherwise null.
                'Photo1'      => $faker->boolean(70) ? 'posts/' . $faker->lexify('photo????') . '.jpg' : null,
                // 50% chance for Photo2 and Photo3
                'Photo2'      => $faker->boolean(50) ? 'posts/' . $faker->lexify('photo????') . '.jpg' : null,
                'Photo3'      => $faker->boolean(50) ? 'posts/' . $faker->lexify('photo????') . '.jpg' : null,
                // 30% chance to generate a file path, otherwise null.
                'File'        => $faker->boolean(30) ? 'posts/' . $faker->lexify('file????') . '.pdf' : null,
            ]);
        }
    }
}
