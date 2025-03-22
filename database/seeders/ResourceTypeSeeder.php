<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResourceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('resource_file_types')->insert([
            ['TypeName' => 'video'],
            ['TypeName' => 'audio'],
            ['TypeName' => 'ebook'],
        ]);
    }
}
