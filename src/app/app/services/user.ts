import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_image?: string;
  balance?: number; // สมมติมี
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base = `${environment.apiUrl}/auth`;
  private adminBase = `${environment.apiUrl}/admin`;
  
private _currentUser = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  me(): Observable<User> {
    const token = localStorage.getItem('token'); // ดึง token ที่ login
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<User>(`${this.base}/me`, { headers }).pipe(
      tap(user => this._currentUser.next(user))
    );
  }

updateProfile(formData: FormData): Observable<any> {
  const token = localStorage.getItem('token');
  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
 return this.http.put(`${this.base}/profile`, formData, { headers }).pipe(
      tap(() => {
        // โหลดข้อมูล user ใหม่หลังอัพเดต
        this.me().subscribe();
      }));
}
  // สำหรับ admin: list users
  listUsers(): Observable<any> {
    return this.http.get(`${this.adminBase}/users`);
  }
}
