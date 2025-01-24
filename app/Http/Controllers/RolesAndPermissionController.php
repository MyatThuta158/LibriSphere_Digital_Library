<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionController extends Controller
{
    public function addPermissions(Request $request){
        Permission::create(['name'=>'Add Genre']);
    }
}
