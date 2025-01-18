import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../@core/environnment';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {
    // Vérifier le token au démarrage du service
    if (this.isLoggedIn()) {
      this.checkToken().subscribe();
    }
  }

  // Nouvelle méthode pour vérifier la validité du token
  checkToken(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/check-token`, { headers }).pipe(
      tap((response: any) => {
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  login(email: string, mot_de_passe: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, mot_de_passe }).pipe(
      tap((response: any) => {
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(nom: string, email: string, mot_de_passe: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${this.apiUrl}/register`,
      { nom, email, mot_de_passe, role: 'user' },
      { headers }
    );
  }

  resetPassword(email: string, name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email, name });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.handleLogout();
      return throwError(() => new Error('Aucun token disponible'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => this.handleLogout()),
      catchError((error: HttpErrorResponse) => {
        // En cas d'erreur d'expiration du token, on force la déconnexion locale
        if (error.error?.exception?.includes('TokenExpiredException')) {
          this.handleLogout();
          return new Observable(subscriber => {
            subscriber.next({ status: 'success' });
            subscriber.complete();
          });
        }
        return throwError(() => error);
      })
    );
  }

  private handleLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mesures');
    localStorage.removeItem('mesures_for');
    localStorage.removeItem('user_measures');
    this.isAuthenticatedSubject.next(false);
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser?.nom || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du nom utilisateur:', error);
      return null;
    }
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Observable pour suivre l'état d'authentification
  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  saveMeasurements(measurements: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/measures`, measurements);
  }
}