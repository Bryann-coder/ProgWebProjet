<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resetLink;
    public $user;

    public function __construct($resetLink, $user)
    {
        $this->resetLink = $resetLink;
        $this->user = $user;
    }

    public function build()
    {
        return $this->view('emails.reset-password')
                    ->subject('Réinitialisation de votre mot de passe')
                    ->with([
                        'resetLink' => $this->resetLink,
                        'user' => $this->user
                    ]);
    }
}
