import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {Router, RouterLinkActive, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-header',
  standalone : true,
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  menuOpen = false;
  isAuthenticated = false;
  userName: string | null = '';
  user : User | null = null;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Vérifier l'état de l'authentification
    this.isAuthenticated = this.authService.isLoggedIn();
    // Récupérer le nom de l'utilisateur si disponible
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName();
      this.user = this.authService.getCurrentUser();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onLoginClick() {
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  onRegisterClick() {
    this.router.navigate(['/register']); // Redirection vers la page d'inscription
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isAuthenticated = false;
        this.userName = null;
        localStorage.removeItem('token'); // Assurez-vous que le token est supprimé localement
        this.router.navigate(['/']); // Redirection après déconnexion
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion:', err);
      }
    });
  }
}
