<?php
namespace Database\Seeders;

use App\Models\VoteTypes;
use Illuminate\Database\Seeder;

class VoteTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the upvote record
        VoteTypes::create(['VoteType' => 'upvote']);

        // Create the downvote record
        VoteTypes::create(['VoteType' => 'downvote']);
    }
}
