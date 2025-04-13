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
    Route::post('/admins/update', [App\Http\Controllers\AdminController::class, 'update']);
    Route::get('/admins/show', [App\Http\Controllers\AdminController::class, 'show']);
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
    Route::get('/Admin/Request/{id}', [App\Http\Controllers\RequestResourcesController::class, 'showForAdmin']);
    Route::put('/updateAdminComments/{id}', [App\Http\Controllers\RequestResourcesController::class, 'updateAdminComment']);
    Route::put('/updateNotiStatus/{id}', [App\Http\Controllers\RequestResourcesController::class, 'updateNotificationStatus']);
    Route::get('/AllPayments', [App\Http\Controllers\SubscriptionController::class, 'getSubscriptionDetails']);
    Route::get('/RejectPayment/{id}', [App\Http\Controllers\SubscriptionController::class, 'showReject']);
    Route::post('/subscriptions/status/{id}', [App\Http\Controllers\SubscriptionController::class, 'updateStatus']);
    // Route::put('/subscriptions/status/{id}', [App\Http\Controllers\SubscriptionController::class, 'updateStatus']);

    Route::get('/NewMemberReport', [App\Http\Controllers\ReportController::class, 'getNewMembersReport']);
    Route::get('/MembershipPlanReport', [App\Http\Controllers\ReportController::class, 'membershipPlanReport']);
    Route::get('/MembershipRevenueReport', [App\Http\Controllers\ReportController::class, 'membershipRevenueReport']);
    Route::get('/TotalRevenueReport', [App\Http\Controllers\ReportController::class, 'totalRevenueReport']);

    Route::get('/allMembership', [App\Http\Controllers\MembershipPlanController::class, 'all']);
    //-----This is to update user information------//
    Route::post('/User/UpdateInfo/{id}', [App\Http\Controllers\UserController::class, 'updateUser']);
    Route::post('/User/UpdateProfile/{id}', [App\Http\Controllers\UserController::class, 'updateProfilePicture']);
    Route::post('/User/ResetPassword', [App\Http\Controllers\UserController::class, 'resetPassword']);
    Route::get('/User/info/{id}', [App\Http\Controllers\UserController::class, 'show']);

    //-----This is to update resource information------//
    Route::post('/Admin/UpdateResource/{id}', [App\Http\Controllers\ResourcesController::class, 'update']);
    // -------------This is routes for reviews-------//
    Route::get('/Resource/Reviews/{id}', [App\Http\Controllers\ReviewsController::class, 'getReviewsByResourceId']);
    Route::post('/Resource/UpdateReviews/{id}', [App\Http\Controllers\ReviewsController::class, 'update']);
    Route::delete('/Resource/ReviewDelete/{id}', [App\Http\Controllers\ReviewsController::class, 'destroy']);

    // -----------This is the route for file download------------//
    Route::get('/downloadFile/{id}', [App\Http\Controllers\FileController::class, 'download']);

    //-----------------This is for forum posts---------------//
    Route::apiResource('posts', App\Http\Controllers\ForumPostController::class);
    Route::post('/posts/update/{id}', [App\Http\Controllers\ForumPostController::class, 'update']);
    Route::get('/userposts/{id}', [App\Http\Controllers\ForumPostController::class, 'userPosts']);
    Route::get('/userposts/report/{id}', [App\Http\Controllers\ForumPostController::class, 'multiIntervalReport']);
    Route::get('/userposts/totalengagement/{id}', [App\Http\Controllers\ForumPostController::class, 'totalUserEngagement']);
    //-----------------This is for forum posts discussion---------------//
    Route::apiResource('discussions', App\Http\Controllers\DiscussionController::class);
    Route::post('/discussion/update/{id}', [App\Http\Controllers\DiscussionController::class, 'update']);
    //-----------------This is for votes---------------//
    Route::apiResource('/votes', App\Http\Controllers\VotesController::class);
    Route::post('/votes/update', [App\Http\Controllers\VotesController::class, 'updateVote']);
    Route::get('/votes/count/{id}', [App\Http\Controllers\VotesController::class, 'countVotes']);
    Route::get('/votes/voters/{id}', [App\Http\Controllers\VotesController::class, 'getVoters']);
    Route::post('/votes/delete', [App\Http\Controllers\VotesController::class, 'delete']);

    Route::post('/userprediction', [App\Http\Controllers\UserPredictionInformationController::class, 'store']);
    Route::get('/userprediction/get', [App\Http\Controllers\UserPredictionInformationController::class, 'index']);

    Route::post('/admin/resetpassword', [App\Http\Controllers\AdminController::class, 'resetPassword']);

    Route::apiResource('/announcement', App\Http\Controllers\AnnouncementController::class);

    Route::get('/admin/resourcetype', [App\Http\Controllers\ResourceTypeController::class, 'index']);

    Route::get('/notification', [App\Http\Controllers\NotificationController::class, 'index']);

    Route::get('/alluser', [App\Http\Controllers\UserController::class, 'index']);
    Route::post('/user/changepassword/{id}', [App\Http\Controllers\UserController::class, 'changeUserPassword']);

    Route::post('/subscription/resubmit/{id}', [App\Http\Controllers\SubscriptionController::class, 'update']);
    Route::get('/subscription/resubmit/show/{id}', [App\Http\Controllers\SubscriptionController::class, 'showResubmit']);

    Route::put('/changeall/noti', [App\Http\Controllers\NotificationController::class, 'markAllNotificationsAsWatched']);

    Route::get('/noti/totalcount', [App\Http\Controllers\NotificationController::class, 'totalCount']);
    Route::get('/subscription/resubmit/{id}', [App\Http\Controllers\SubscriptionController::class, 'showSubscriptionDetailWithLatestNotification']);

    //----This will used to check whether there need to show membership plan or not----//
    Route::get('/subscription/check/{id}', [App\Http\Controllers\SubscriptionController::class, 'checkUserSubscriptionStatus']);

    Route::get('/subscription/detailshow/{id}', [App\Http\Controllers\SubscriptionController::class, 'getSubscriptionDataWithNotifications']);

    Route::post('/subscription/cancle/{id}', [App\Http\Controllers\SubscriptionController::class, 'cancelSubscriptionOnly']);
    Route::post('/subscriber/prediction/store', [App\Http\Controllers\SubscriberPredictionController::class, 'storePredictions']);
    Route::get('/subscriber/prediction/get', [App\Http\Controllers\SubscriberPredictionController::class, 'getLatestPredictions']);

    Route::get('/subscriptiondate/{id}', [App\Http\Controllers\SubscriptionController::class, 'getUserSubscriptionInfo']);

    Route::get('/admindashboard', [App\Http\Controllers\DashboardController::class, 'adminDashboard']);
});

Route::match(['get', 'post'], '/upload-chunk', [\App\Http\Controllers\UploadController::class, 'uploadChunk']);
Route::get('/streamVideo/{id}', [App\Http\Controllers\FileController::class, 'stream']);
Route::post('/UserRegister', [App\Http\Controllers\UserController::class, 'store']);
Route::post('/Subscription/Register', [App\Http\Controllers\SubscriptionController::class, 'store']);
Route::get('/Memberships/show', [App\Http\Controllers\MembershipPlanController::class, 'index']);
Route::get('/Memberships/Payments', [App\Http\Controllers\PaymentTypesController::class, 'index']);
// Route::apiResource('/resources', App\Http\Controllers\ResourcesController::class);
Route::post('/admins/register', [App\Http\Controllers\AdminController::class, 'store']);

Route::get('/resource/search', [App\Http\Controllers\ResourcesController::class, 'search']);
Route::get('/resource/{id}', [App\Http\Controllers\ResourcesController::class, 'show']);
Route::post('/Reviews/Add', [App\Http\Controllers\ReviewsController::class, 'store']);
Route::post('/admin/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');

Route::get('/getResource', [App\Http\Controllers\ResourcesController::class, 'getResource']);
