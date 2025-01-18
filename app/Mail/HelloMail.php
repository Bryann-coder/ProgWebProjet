<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HelloMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        //
    }

    /*
    *Build the message
    *
    * @return $this
    */

    public function build()
    {
<<<<<<< HEAD
        return $this->view('email.hello');
=======
        return $this->view('emails.hello');
>>>>>>> 45e1e5731dc8d764d3e64def60cc6c8da06abbb9
    }

    /**
     * Get the message envelope.
     */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Hello Mail',
    //     );
    // }

    // /**
    //  * Get the message content definition.
    //  */
    // public function content(): Content
    // {
    //     return new Content(
    //         view: 'view.name',
    //     );
    // }

    // /**
    //  * Get the attachments for the message.
    //  *
    //  * @return array<int, \Illuminate\Mail\Mailables\Attachment>
    //  */
    // public function attachments(): array
    // {
    //     return [];
    // }
}
