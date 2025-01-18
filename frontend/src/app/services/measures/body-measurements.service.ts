import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {environment} from '../../@core/environnment';
import {Measure} from '../../models/measure';

type MeasureKey = keyof Omit<Measure, 'id' | 'user_id'>;
@Injectable({
  providedIn: 'root'
})
export class BodyMeasurementsService {
  private apiUrl = `${environment.apiMens}/measurements`

  constructor(private http: HttpClient) {}

  /**
   * Upload an image and retrieve body measurements.
   * @param file The image file to upload (JPEG or PNG)
   * @returns Observable with the body measurements data
   */
  getMeasurements(file: File): Observable<MeasureKey> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<MeasureKey>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }
  extractMeasurements(image: File): Observable<MeasureKey> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<MeasureKey>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de l’extraction des mesures:', error);
        // Personnalisez le message d'erreur
        return throwError(() => new Error('Une erreur est survenue. Veuillez réessayer.'));
      })
    );
  }


  /**
   * Handles HTTP errors
   * @param error The HTTP error response
   * @returns An Observable that throws an error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
