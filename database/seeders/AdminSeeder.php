<?php
namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Optionally clear the admin table to avoid duplicates
        Admin::truncate();

        $admins = [
            [
                'Name'           => 'Myat',
                'Email'          => 'myat123@example.com',
                // Make sure to hash the password
                'Password'       => Hash::make('password123'),
                'role'           => 'librarian',
                'Gender'         => 'Male',
                'PhoneNumber'    => '1234567890',
                'ProfilePicture' => null,
            ],
            [
                'Name'           => 'Thuta',
                'Email'          => 'admin123@gmail.com',
                'Password'       => Hash::make('password123'),
                'role'           => 'manager',
                'Gender'         => 'Female',
                'PhoneNumber'    => '0987654321',
                'ProfilePicture' => null,
            ],
        ];

        foreach ($admins as $adminData) {
            $admin = Admin::create($adminData);

            // If you are using a role management package (e.g., Spatie),
            // you can optionally assign the role:
            if (method_exists($admin, 'assignRole')) {
                $admin->assignRole($adminData['role']);
            }
        }
    }
}
