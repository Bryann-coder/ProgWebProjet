import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {StylistsService} from '../../../services/stylists/stylists.service';
import { PageRefreshService } from '../../../services/refresh/page-refresh.service';

@Component({
  selector: 'app-login-form',
  imports:[FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private stylistService: StylistsService,
    private pageRefreshService: PageRefreshService,
    private toastr: ToastrService
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/']);
    }
  }

  loading: boolean = false;

  login() {
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        this.loading = false;
        localStorage.setItem('token', response.authorisation.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('user_measures',JSON.stringify(response.user.mesures));
        this.stylistService.setConnectedStylist();
        this.router.navigate(['/']);
        this.pageRefreshService.refreshPage();
        this.toastr.success('Connexion avec succes')
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    );
  }


  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onForgetClick() {
    this.router.navigate(['/login']);
  }

}
