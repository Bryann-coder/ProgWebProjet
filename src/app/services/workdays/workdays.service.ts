import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Workday} from '../../models/Workday';
import {environment} from '../../@core/environnment';

@Injectable({
  providedIn: 'root'
})
export class WorkdaysService {
  private baseUrl = `${environment.apiUrl}/workdays`;

  constructor(private http: HttpClient) {}

  getWorkdaysByStylist(stylistId: number): Observable<Workday[]> {
    return this.http.get<Workday[]>(`${this.baseUrl}/stylist/${stylistId}`);
  }
}
