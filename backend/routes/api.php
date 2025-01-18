<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MeasureController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StylistController;
use App\Http\Controllers\WorkdayController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PhotoController;
use Illuminate\Http\Request;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:api');

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('refresh', [AuthController::class, 'refresh']);
Route::get('check-token', [AuthController::class, 'checkToken']);

Route::middleware('auth:api')->group(function () {});

Route::get('/users', [AuthController::class, 'index']);
Route::get('/users/{user}', [AuthController::class, 'show']);
Route::put('/users/{user}', [AuthController::class, 'update']);
Route::delete('/users/{user}', [AuthController::class, 'destroy']);



Route::apiResource('products', ProductController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('measures', MeasureController::class);

Route::apiResource('stylists', StylistController::class);

Route::apiResource('reviews', ReviewController::class);
Route::get('products/{product}/reviews', [ReviewController::class, 'getProductReviews']);
Route::get('products/{product}/average-rating', [ReviewController::class, 'getAverageRating']);



Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('reset-password', [ResetPasswordController::class, 'reset']);



Route::get('/workdays', [WorkdayController::class, 'index'])
    ->name('workdays.index');
Route::get('/workdays/{workday}', [WorkdayController::class, 'show'])
    ->name('workdays.show');
Route::put('/workdays/{workday}', [WorkdayController::class, 'update'])
    ->name('workdays.update');
Route::delete('/workdays/{workday}', [WorkdayController::class, 'destroy'])
    ->name('workdays.destroy');
Route::post('/workdays/update-status', [WorkdayController::class, 'updateStatus'])
    ->name('workdays.update-status');
Route::get('/workdays/stylist/{stylist}', [WorkdayController::class, 'getStylistWorkdays'])
    ->name('workdays.by-stylist');
Route::get('/workdays/user/{user}', [WorkdayController::class, 'getUserWorkdays'])
    ->name('workdays.by-user');
Route::get('/workdays/date/{date}', [WorkdayController::class, 'getWorkdaysByDate'])
    ->name('workdays.by-date');
Route::post('/workdays/request', [WorkdayController::class, 'requestAppointment'])->name('workdays.request');
Route::post('/workdays/confirm/{stylist}/{user}/{date}', [WorkdayController::class, 'confirmAppointment'])
        ->name('workdays.confirm');

Route::post('payment', [PaymentController::class, 'submit_payment']);
Route::get('/payments', [PaymentController::class, 'index']);
Route::get('/payments/{payment}', [PaymentController::class, 'show']);
Route::post('/payment/status', [PaymentController::class, 'payment_status']);
Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);

Route::get('/carts', [CartController::class, 'index']);
Route::get('/carts/{cart}', [CartController::class, 'show']);
Route::post('/carts', [CartController::class, 'store']);
Route::delete('/carts/{cart}', [CartController::class, 'destroy']);

Route::get('/stylists/user/{userId}', [StylistController::class, 'getStylistByUser']);

Route::get('/stylists/{stylist}/reviews', [StylistController::class, 'getReviewsByStylist']);

