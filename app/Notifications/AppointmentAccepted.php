<?php

namespace App\Notifications;

use App\Models\Workday;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentAccepted extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Workday $workday
    ) {}

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Réservation acceptée')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Votre réservation a été acceptée par le styliste.')
            ->line('Date : ' . $this->workday->date->format('d/m/Y'))
            ->line('Merci de votre confiance !');
    }
}
