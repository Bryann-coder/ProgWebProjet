import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, throwError} from 'rxjs';
import { environment } from '../../@core/environnment';
import { Stylist } from '../../models/Stylist';
import {catchError} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {Review} from '../../models/Review';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root'
})
export class StylistsService {
  private apiUrl = `${environment.apiUrl}/stylists`;

  constructor(private http: HttpClient, private authService: AuthService, private imageService: ImageService ) {}

  getAllStylists(): Observable<Stylist[]> {
    return this.http.get<Stylist[]>(`${this.apiUrl}`).pipe(
      map(stylists =>
        stylists.map(stylist => ({
          ...stylist,
          photo: this.imageService.updateImageUrl(stylist.image)
           // Modifier le champ photo
        }))
      )
    );
  }


  getStylistById(id: number): Observable<Stylist> {
    return this.http.get<Stylist>(`${this.apiUrl}/${id}`).pipe(
      map(stylist => ({
        ... stylist,
        photo: this.imageService.updateImageUrl(stylist.image),
        products: stylist.products?.map(product =>({
          ...product,
          image: this.imageService.updateImageUrl(product.image)
        }) )

  }))
    );
  }

  saveStylist(stylistData: {
    user_id: number;
    bibliography: string;
    specialite: string;
    rating: number;
  }): Observable<any> {
    return this.http.post(this.apiUrl, stylistData);
  }

  getStylistByUser(id: number): Observable<Stylist> {
    return this.http.get<{ stylist: Stylist; status: string }>(`${this.apiUrl}/user/${id}`).pipe(
      map((response) => response.stylist), // Extraction du champ "stylist"
      catchError((error) => {
        console.error('Erreur lors de la récupération des données du styliste :', error);
        return throwError(() => new Error('Erreur de récupération du styliste.'));
      })
    );
  }



  getStylisteProfil(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateStylisteProfil(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }


  setConnectedStylist(): void {
    const isAuthenticated = this.authService.isLoggedIn();
    if (isAuthenticated) {
      const user = this.authService.getCurrentUser();
      const userId = user?.id
      if (userId && user?.role === 'stylist') {
        this.getStylistByUser(userId).subscribe({
          next: (stylist: Stylist) => {
            try {
              localStorage.setItem('stylist', JSON.stringify(stylist));
              console.log('Styliste connecté sauvegardé dans le localStorage.', stylist);
            } catch (error) {
              console.error('Erreur lors de la sauvegarde du styliste dans le localStorage :', error);
            }
          },
          error: (err) => {
            console.error('Erreur lors de la récupération du styliste :', err);
          },
        });
      } else {
        console.warn('Pas de styliste trouvé');
      }
    } else {
      console.warn('Utilisateur non authentifié.');
    }
  }
  // Récupère le styliste connecté
  getConnectedStylist(): Stylist | null {
    try {
      const stylistData = localStorage.getItem('stylist');
      console.log('styliste en cours',stylistData)
      if (!stylistData) {
        return null;
      }
      return JSON.parse(stylistData) as Stylist;
    } catch (error) {
      console.error('Erreur lors de la récupération du styliste connecté :', error);
      return null;
    }
  }

  // Supprime les données du styliste connecté
  clearConnectedStylist(): void {
    try {
      localStorage.removeItem('stylist');
      console.log('Styliste connecté supprimé du localStorage.');
    } catch (error) {
      console.error('Erreur lors de la suppression des données du styliste :', error);
    }
  }

  getReviewsbyStylist(id: number): Observable<Review[]> {
    return this.http.get<{ stylist_id: number; reviews: Review[] }>(`${this.apiUrl}/${id}/reviews`).pipe(
      map((response) => {
        if (Array.isArray(response.reviews)) {
          return response.reviews; // Retourne les avis si présents
        }
        console.warn('Aucun avis trouvé pour ce styliste.');
        return []; // Retourne un tableau vide si pas d'avis
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des avis :', error);
        return throwError(() => new Error('Erreur de récupération des avis.'));
      })
    );
  }

  revokeStylist(stylistId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${stylistId}`);
  }

}
