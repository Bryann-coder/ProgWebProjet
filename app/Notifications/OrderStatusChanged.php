<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private readonly Order $order
    ) {}

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $status = match ($this->order->status) {
            0 => 'en attente',
            1 => 'en cours',
            2 => 'terminé',
            default => 'inconnu'
        };

        return (new MailMessage)
            ->subject('Mise à jour de votre commande')
            ->greeting('Bonjour ' . $notifiable->nom)
            ->line('Le statut de votre commande a été mis à jour.')
            ->line("Votre commande est maintenant {$status}.")
            ->action('Voir ma commande', url("/orders/{$this->order->id}"))
            ->line('Merci de nous faire confiance !');
    }
}