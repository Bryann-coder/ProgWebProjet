import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Stylist } from '../../models/Stylist';
import { StylistsService } from '../../services/stylists/stylists.service';
import { FormsModule } from '@angular/forms';

interface StylistWithProducts extends Stylist {
  productsCount: number;
}

@Component({
  selector: 'app-stylists',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stylists.component.html',
  styleUrl: './stylists.component.css'
})
export class StylistsComponent {
  searchTerm: string = '';
  styliste: any;
  editMode: any = {};
  isSaved = false;
  isLoading = false;
  stylists: Stylist[] = [];
  sortBy: string = 'rating';
  specialities: string[] = [];
  error: string | null = null;
  selectedSpeciality: string = '';

  constructor(private router: Router, private http: HttpClient, private stylistsService: StylistsService) {}

  ngOnInit(): void {
    this.fetchStylists();
    this.extractSpecialities();

    const storedStyliste = localStorage.getItem('styliste');
    if (storedStyliste) {
      this.styliste = JSON.parse(storedStyliste);
    }
    this.editMode = {
      nom: false,
      email: false,
      biographie: false,
      experience: false
    };
  }

  editField(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  saveProfile() {
    this.isLoading = true;

    // Récupère l'ID du styliste connecté
    const connectedStylist = this.stylistsService.getConnectedStylist();

    if (!connectedStylist) {
      console.error('Aucun styliste connecté');
      this.isLoading = false;
      return;
    }

    // Conversion explicite de l'ID en string
    this.stylistsService.updateStylisteProfil(connectedStylist.id.toString(), this.styliste)
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.isSaved = true;

          // Mettre à jour le localStorage avec les nouvelles données du styliste
          localStorage.setItem('styliste', JSON.stringify(this.styliste));

          console.log('Profil du styliste mis à jour avec succès', response);
        },
        (error) => {
          this.isLoading = false;
          console.error('Erreur de mise à jour du profil du styliste', error);
        }
      );
  }


  extractSpecialities(): void {
    const uniqueSpecialities = new Set(this.stylists.map(s => s.specialite));
    this.specialities = Array.from(uniqueSpecialities);
  }

  getFilteredStylists(): Stylist[] {
    return this.stylists.filter(stylist => {
      const matchesSearch = stylist.user?.nom.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpeciality = !this.selectedSpeciality || stylist.specialite === this.selectedSpeciality;
      return matchesSearch && matchesSpeciality;
    });
  }

  fetchStylists(): void {
    this.stylistsService.getAllStylists().subscribe({
      next: (data) => {
        this.stylists = data;
        this.stylists.forEach(stylist => {
          console.log(stylist);

          console.log(stylist.photo);
        });
        this.extractSpecialities();
      },
      error: (err) => {
        this.error = 'Une erreur est survenue lors du chargement des stylistes.';
        console.error(err);
      }
    });
  }


  getTotalCreations(): number {
    return this.stylists.reduce((sum, stylist) =>
      sum + (stylist.products?.length || 0), 0);
  }

  sortStylists(): void {
    this.stylists.sort((a, b) => {
      switch (this.sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'creations':
          return (b.products?.length || 0) - (a.products?.length || 0);
        default: return 0;
      }
    });
  }

  getStarsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  }

  viewStylist(stylistId: number): void {
    this.router.navigate(['/stylists', stylistId]);
  }

  filterStylists(): Stylist[] {
    return this.stylists.filter(stylist => {
      const matchesSearch = stylist.user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stylist.bibliography.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSpeciality = !this.selectedSpeciality || stylist.specialite === this.selectedSpeciality;
      return matchesSearch && matchesSpeciality;
    });
  }

  getAverageRating(): number {
    return this.stylists.reduce((sum, stylist) => sum + stylist.rating, 0) / this.stylists.length;
  }
}
