<?php

use App\Mail\HelloMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {

    // Mail::to('anonymefrank167@gmail.com')->send(new \App\Mail\HelloMail());

    // // return view('welcome');

    // Mail::to('yobobryan@gmail.com')
    //     ->send(new HelloMail());
});
