<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('authors')->insert([
            ['name' => 'J.K. Rowling'],
            ['name' => 'George R.R. Martin'],
            ['name' => 'J.R.R. Tolkien'],
            ['name' => 'Stephen King'],
            ['name' => 'Agatha Christie'],
            ['name' => 'Jane Austen'],
            ['name' => 'Mark Twain'],
            ['name' => 'Charles Dickens'],
            ['name' => 'Ernest Hemingway'],
            ['name' => 'Leo Tolstoy'],
        ]);
    }
}
