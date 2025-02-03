<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\FileController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::post('/UserRegister',[App\Http\Controllers\UserController::class,'store']);
// Route::get('/UserRegister',[App\Http\Controllers\UserController::class,'index']);
//Route::post('/login', [App\Http\Controllers\UserController::class,'login']);





Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admins/register',[App\Http\Controllers\AdminController::class,'store']);
     Route::apiResource('/admins',App\Http\Controllers\AdminController::class);
    Route::apiResource('/authors', App\Http\Controllers\AuthorsController::class);
    Route::apiResource('/genres', App\Http\Controllers\GenreController::class);
    Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);
    Route::apiResource('/memberships', App\Http\Controllers\MembershipPlanController::class);
    Route::apiResource('/payment_types', App\Http\Controllers\PaymentTypesController::class);
    Route::apiResource('/subscriptions', App\Http\Controllers\SubscriptionController::class);
});

//Route::apiResource('/admins',App\Http\Controllers\AdminController::class);
Route::post('/UserRegister', [App\Http\Controllers\UserController::class,'store']);
Route::post('/Subscription/Register', [App\Http\Controllers\SubscriptionController::class,'store']);
Route::get('/Memberships/show', [App\Http\Controllers\MembershipPlanController::class,'index']);
Route::get('/Memberships/Payments', [App\Http\Controllers\PaymentTypesController::class,'index']);
// Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);
 Route::post('/admins/register',[App\Http\Controllers\AdminController::class,'store']);
//     Route::apiResource('/admins',App\Http\Controllers\AdminController::class);
//     Route::apiResource('/authors', App\Http\Controllers\AuthorsController::class);
//     Route::apiResource('/genres', App\Http\Controllers\GenreController::class);

// Route::post('/admins/register',[App\Http\Controllers\AdminController::class,'store']);
Route::get('/resource/search', [App\Http\Controllers\ResourcesController::class, 'search']);
Route::get('/resource/{id}', [App\Http\Controllers\ResourcesController::class, 'show']);
Route::post('/Reviews/Add', [App\Http\Controllers\ReviewsController::class, 'store']);
Route::post('/admin/login', [App\Http\Controllers\AuthController::class,'login'])->name('login');
Route::get('/{filename}', [App\Http\Controllers\FileController::class, 'getPublicFile']);
// Route::options('/{any}', function () {
//     return response()->json([]);
// })->where('any', '.*');

// Route::get('/{filename}', function ($filename) {
//     $path = public_path("{$filename}");
//     if (!file_exists($path)) {
//         abort(404);
//     }

//     if (file_exists($path)) {
//         return response()->json(['message'=>'file exist']);
//     }

//     return response()->file($path, [
//         'Access-Control-Allow-Origin' => '*', // Allow all origins
//         'Access-Control-Allow-Methods' => '*',
//         'Access-Control-Allow-Headers' => '*',
//     ]);
// })->middleware('cors');




//------This is for permissions------//
//Route::get('add-permissions',[App\Http\Controllers\RolesAndPermissionController::class,'addPermissions']);