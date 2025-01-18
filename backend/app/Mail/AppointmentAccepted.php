<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Workday;
use App\Models\Stylist;
use App\Models\User;
use Carbon\Carbon;

class AppointmentAccepted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Stylist $stylist,
        public User $user,
        public string $date
    ) {}

    public function build()
    {
        return $this->view('emails.appointment-accepted')
                    ->subject('Nouvelle demande de réservation')
                    ->with([
                        'stylist' => $this->stylist,
                        'user' => $this->user,
                        'date' => Carbon::parse($this->date)->format('d/m/Y')
                    ]);
    }
}