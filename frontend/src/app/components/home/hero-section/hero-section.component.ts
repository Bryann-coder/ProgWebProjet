import { Component } from '@angular/core';
import { User } from '../../../models/User';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stylist } from '../../../models/Stylist';
import { StylistsService } from '../../../services/stylists/stylists.service';
import { ToastrService } from 'ngx-toastr'; // Importer le ToastrService
import { PageRefreshService } from '../../../services/refresh/page-refresh.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
  nom: string = '';
  email: string = '';
  bibliography: string = '';
  specialite: string = '';
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private stylistService: StylistsService,
    private router: Router,
    private toastr: ToastrService,
    private pageRefreshService: PageRefreshService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser(); // Récupérer l'utilisateur connecté
    this.nom = this.user?.nom || '';
    this.email = this.user?.email || '';
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Vérifier si l'utilisateur est connecté
  }

  onSubmit(): void {
    if (!this.isUserLoggedIn()) {
      // Afficher un toast ou un message d'erreur si l'utilisateur n'est pas connecté
      this.toastr.error('L\'utilisateur doit être connecté pour soumettre ce formulaire');
      this.router.navigate(['/login']);
      return;
    }


    if (this.user?.id === undefined || this.user.id === null) {
      this.toastr.error('Pas d\'utilisateur connecté'); // Ajouter un toast pour l'erreur
      return;
    }

    const stylistData = {
      user_id: this.user.id!,
      bibliography: this.bibliography,
      specialite: this.specialite,
      rating: 0
    };

    this.stylistService.saveStylist(stylistData).subscribe({
      next: (response) => {
        if (this.user) {
          this.user.role = 'stylist';
          localStorage.setItem('user', JSON.stringify(this.user));
          const stylist: Stylist = {
            ...response,
            user: this.user,
            products: [],
            workdays: [],
            reviews: [],
            orders: []
          };
          localStorage.setItem('stylist', JSON.stringify(stylist));
          this.pageRefreshService.refreshPage();

        }
        console.log('Styliste enregistré avec succès:', response);
        this.toastr.success('Vous faites desormais parti de nos stylistes!');
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement du styliste:', error);
        this.toastr.error('Erreur lors de votre enregistrement en tant que styliste.');
      }
    });
  }
}