<?php

namespace Database\Seeders;

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $permissions = [
            'Add Genre',
            'Edit Genre',
            'Delete Genre',
            'Add Resource',
            'Edit Resource',
            'Delete Resource',
            'Add User',
            'Edit User',
            'Delete User',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles and assign permissions
        $rolesAndPermissions = [
            'librarian' => ['Add Genre', 'Edit Genre', 'Delete Genre', 'Add Resource', 'Edit Resource', 'Delete Resource'],
            'owner' => ['Add Genre', 'Edit Genre', 'Delete Genre', 'Add Resource', 'Edit Resource', 'Delete Resource', 'Add User', 'Edit User', 'Delete User'],
            'manager' => ['Add Genre', 'Edit Genre', 'Delete Genre', 'Add Resource', 'Edit Resource', 'Delete Resource', 'Add User', 'Edit User', 'Delete User'],
        ];

        foreach ($rolesAndPermissions as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->givePermissionTo($permissions);
        }

        // Create a test user and assign a role
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
                'password'=>'dajljldajlfd',
                'phone_number'=>'0938383829',
                'age'=>23,
                'role'=>'librarian',
        ]);

        $user->assignRole('librarian');
    }
}
