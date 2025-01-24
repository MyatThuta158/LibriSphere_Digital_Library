<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/UserRegister',[App\Http\Controllers\UserController::class,'store']);
Route::get('/UserRegister',[App\Http\Controllers\UserController::class,'index']);
Route::post('/login', [App\Http\Controllers\UserController::class,'login']);
Route::apiResource('/authors', App\Http\Controllers\AuthorsController::class);
Route::apiResource('/genres', App\Http\Controllers\GenreController::class);
Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);

Route::apiResource('/admins',App\Http\Controllers\AdminController::class);

Route::get('/{filename}', function ($filename) {
    $path = public_path("{$filename}");
    if (!file_exists($path)) {
        abort(404);
    }

    if (file_exists($path)) {
        return response()->json(['message'=>'file exist']);
    }

    return response()->file($path, [
        'Access-Control-Allow-Origin' => '*', // Allow all origins
        'Access-Control-Allow-Methods' => '*',
        'Access-Control-Allow-Headers' => '*',
    ]);
})->middleware('cors');




//------This is for permissions------//
//Route::get('add-permissions',[App\Http\Controllers\RolesAndPermissionController::class,'addPermissions']);