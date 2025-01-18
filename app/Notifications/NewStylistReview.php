<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewStylistReview extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Review $review
    ) {}

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle évaluation reçue')
            ->greeting('Bonjour ' . $notifiable->nom)
            ->line('Vous avez reçu une nouvelle évaluation.')
            ->line("Note : {$this->review->note}/5")
            ->line("Commentaire : {$this->review->commentaire}")
            ->action('Voir l\'évaluation', url("/reviews/{$this->review->id}"))
            ->line('Merci de votre excellent travail !');
    }
}
