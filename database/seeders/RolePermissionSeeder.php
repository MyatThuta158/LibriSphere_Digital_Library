<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permissions
        Permission::firstOrCreate(['name' => 'manage users', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage resources', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage authors', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage genre', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'view resources', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage membershipPlans', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage payment_types', 'guard_name' => 'api']);
        Permission::firstOrCreate(['name' => 'manage request', 'guard_name' => 'api']);

        // Roles
        $librarian = Role::firstOrCreate(['name' => 'librarian', 'guard_name' => 'api']);
        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'api']);
        $member = Role::firstOrCreate(['name' => 'member', 'guard_name' => 'api']);
        $member = Role::firstOrCreate(['name' => 'community_member', 'guard_name' => 'api']);

        // Assign Permissions
        $librarian->syncPermissions(['manage resources','manage membershipPlans','manage payment_types', 'manage authors', 'manage genre', 'view resources','manage request']);
        $manager->syncPermissions(['manage resources','manage membershipPlans','manage payment_types', 'manage authors', 'manage genre', 'manage users', 'view resources','manage request']);
        $member->syncPermissions(['view resources','manage request']);
    }
}
