<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAppointment extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly array $data
    ) {}

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau rendez-vous programmé')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line('Un nouveau rendez-vous a été programmé.')
            ->line('Date : ' . $this->data['date'])
            ->action('Accepter le rendez-vous', url("/workdays/{$this->data['stylist_id']}/accept"))
            ->line('À bientôt !');
    }
}
