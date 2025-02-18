<?php

use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::post('/UserRegister',[App\Http\Controllers\UserController::class,'store']);
// Route::get('/UserRegister',[App\Http\Controllers\UserController::class,'index']);
//Route::post('/login', [App\Http\Controllers\UserController::class,'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/admins/register', [App\Http\Controllers\AdminController::class, 'store']);
    Route::apiResource('/admins', App\Http\Controllers\AdminController::class);
    Route::apiResource('/authors', App\Http\Controllers\AuthorsController::class);
    Route::apiResource('/genres', App\Http\Controllers\GenreController::class);
    Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);
    Route::apiResource('/memberships', App\Http\Controllers\MembershipPlanController::class);
    Route::post('/memberships/update/{id}', [App\Http\Controllers\MembershipPlanController::class, 'update']);
    Route::apiResource('/payment_types', App\Http\Controllers\PaymentTypesController::class);
    Route::post('/payment_types/update/{id}', [App\Http\Controllers\PaymentTypesController::class, 'update']);
    Route::apiResource('/subscriptions', App\Http\Controllers\SubscriptionController::class);
    Route::apiResource('/Requests', App\Http\Controllers\RequestResourcesController::class);
    Route::post('/updateRole', [App\Http\Controllers\UserController::class, 'updateRole']);
    Route::put('/updateAdminComments/{id}', [App\Http\Controllers\RequestResourcesController::class, 'updateAdminComment']);
    Route::put('/updateNotiStatus/{id}', [App\Http\Controllers\RequestResourcesController::class, 'updateNotificationStatus']);
    Route::get('/AllPayments', [App\Http\Controllers\SubscriptionController::class, 'getSubscriptionDetails']);
    Route::put('/subscriptions/status/{id}', [App\Http\Controllers\SubscriptionController::class, 'updateStatus']);
    Route::put('/subscriptions/status/{id}', [App\Http\Controllers\SubscriptionController::class, 'updateStatus']);

    Route::get('/NewMemberReport', [App\Http\Controllers\ReportController::class, 'getNewMembersReport']);
    Route::get('/MembershipPlanReport', [App\Http\Controllers\ReportController::class, 'membershipPlanReport']);
    Route::get('/MembershipRevenueReport', [App\Http\Controllers\ReportController::class, 'membershipRevenueReport']);
    Route::get('/TotalRevenueReport', [App\Http\Controllers\ReportController::class, 'totalRevenueReport']);

    //-----This is to update user information------//
    Route::patch('/User/UpdateInfo/{id}', [App\Http\Controllers\UserController::class, 'updateInfo']);
    Route::post('/User/UpdateProfile/{id}', [App\Http\Controllers\UserController::class, 'updateProfilePicture']);

    // -------------This is routes for reviews-------//
    Route::get('/Resource/Reviews/{id}', [App\Http\Controllers\ReviewsController::class, 'getReviewsByResourceId']);
});

// Route::get('/file/{filename}', function ($filename) {
//     $filePath = storage_path('app/public/' . $filename);

//     if (! File::exists($filePath)) {
//         abort(404);
//     }

//     $mimeType = File::mimeType($filePath);
//     $headers  = [
//         'Content-Type'                => $mimeType,
//         'Access-Control-Allow-Origin' => '*',
//     ];

//     return Response::file($filePath, $headers);
// });

Route::get('/downloadFile', [App\Http\Controllers\FileController::class, 'download']);
//Route::get('/RequestLists',[App\Http\Controllers\RequestResourcesController::class,'show']);
//Route::post('/Requests', [App\Http\Controllers\RequestResourcesController::class,'store']);
//Route::apiResource('/admins',App\Http\Controllers\AdminController::class);
Route::post('/UserRegister', [App\Http\Controllers\UserController::class, 'store']);
Route::post('/Subscription/Register', [App\Http\Controllers\SubscriptionController::class, 'store']);
Route::get('/Memberships/show', [App\Http\Controllers\MembershipPlanController::class, 'index']);
Route::get('/Memberships/Payments', [App\Http\Controllers\PaymentTypesController::class, 'index']);
// Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);
Route::post('/admins/register', [App\Http\Controllers\AdminController::class, 'store']);
//     Route::apiResource('/admins',App\Http\Controllers\AdminController::class);
//     Route::apiResource('/authors', App\Http\Controllers\AuthorsController::class);
//     Route::apiResource('/genres', App\Http\Controllers\GenreController::class);

// Route::post('/admins/register',[App\Http\Controllers\AdminController::class,'store']);
Route::get('/resource/search', [App\Http\Controllers\ResourcesController::class, 'search']);
Route::get('/resource/{id}', [App\Http\Controllers\ResourcesController::class, 'show']);
Route::post('/Reviews/Add', [App\Http\Controllers\ReviewsController::class, 'store']);
Route::post('/admin/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');
//Route::get('/{filename}', [App\Http\Controllers\FileController::class, 'getPublicFile']);
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
