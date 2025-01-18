import { Component } from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { PageRefreshService } from '../../../services/refresh/page-refresh.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private pageRefreshService: PageRefreshService,
    private toastr: ToastrService
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  loading: boolean = false;

  signup() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.name, this.email, this.password).subscribe(
      (response) => {
        this.loading = false;
        // Stocker le token si renvoyé par l'API
        if (response.Authorization.token) {
          localStorage.setItem('token', response.Authorization.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        this.router.navigate(['/']);
        this.pageRefreshService.refreshPage();
        this.toastr.success('Enregistrement avec succes');
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Une erreur est survenue lors de l\'inscription';
      }
    );
  }

}
