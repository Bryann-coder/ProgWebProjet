import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../@core/environnment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl: string = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  makePayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl+"/payment", paymentData, { headers });
  }
}
