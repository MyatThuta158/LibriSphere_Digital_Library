<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Http\Request;
use App\Http\Controllers\AdminController; // Replace with your actual controller

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Myat',
                'email' => 'myat123@example.com',
                'password' => 'password123', // Plain text (store method hashes it)
                'role' => 'librarian', // Ensure this matches your form field name
                'gender' => 'Male',
                'phone_number' => '1234567890',
                'profile_picture' => null,
            ],
            [
                'name' => 'Thuta',
                'email' => 'myatthuta232@gmail.com',
                'password' => 'password123',
                'role' => 'manager',
                'gender' => 'Female',
                'phone_number' => '0987654321',
                'profile_picture' => null,
            ]
        ];

        foreach ($admins as $adminData) {
            // Simulate a request with admin data
            $request = new Request($adminData);

            // Resolve the controller from the container
            $controller = app()->make(AdminController::class);

            // Call the store method
            $controller->store($request);
        }
    }
}
