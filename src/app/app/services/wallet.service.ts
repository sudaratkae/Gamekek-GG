import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private baseUrl = `${environment.apiUrl}/wallet`;

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.baseUrl}/balance`, this.getHeaders());
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/history`, this.getHeaders());
  }

  topUp(amount: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/topup`,
      { amount },
      this.getHeaders()
    );
  }
}
