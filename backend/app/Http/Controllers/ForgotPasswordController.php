<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                    ->where('nom', $request->name)
                    ->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Les informations ne correspondent à aucun compte.'],
            ]);
        }

        $token = Password::createToken($user);
        $resetUrl = "http://localhost:4200/new-password?token=" . $token . "&email=" . urlencode($user->email);

        Mail::to($user->email)->send(new ResetPasswordMail($resetUrl, $user));

        return response()->json([
            'message' => 'Email de réinitialisation envoyé avec succès.',
            'status' => 'success',
            'token' => $token
        ]);
    }
}
