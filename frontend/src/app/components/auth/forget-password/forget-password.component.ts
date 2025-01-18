import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  email = '';
  name = '';
  loading = false;
  message = '';
  error = '';

  constructor(private authService: AuthService) {}

  sendResetLink() {
    this.loading = true;
    this.authService.resetPassword(this.email, this.name).subscribe({
      next: () => {
        this.message =
          'Le lien de réinitialisation a été envoyé à votre adresse email.';
        this.loading = false;
      },
      error: (err) => {
        this.error = "Erreur lors de l'envoi du lien. Veuillez réessayer.";
        this.loading = false;
      },
    });
  }
}
