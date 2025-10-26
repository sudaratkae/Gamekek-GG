import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GameService {
  private apiUrl = `${environment.apiUrl}/games`;
  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getGames(search?: string, category?: string): Observable<any[]> {
    const params: any = {};
    if (search) params.search = search;
    if (category) params.category = category;
    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getGame(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addGame(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-games`, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
    });
  }

  updateGame(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
    });
  }

  deleteGame(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }),
    });
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/list`);
  }
}
