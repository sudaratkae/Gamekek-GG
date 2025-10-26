import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
export interface User {
  id: number;
  email: string;
  role: string;
}

export interface LoginResp {
  token: string;
  user: User;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private base = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}

  register(formData: FormData) {
    return this.http.post(`${this.base}/register`, formData);
  }

  login(email: string, password: string): Observable<LoginResp> {
    return this.http
      .post<LoginResp>(`${this.base}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res?.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
          }
        })
      );
  }
  loginAdmin(email: string, password: string) {
    return this.http
      .post<LoginResp>(`${this.base}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res?.token) {
            if (res.user?.role === 'admin') {
              localStorage.setItem('token', res.token);
              localStorage.setItem('role', res.user.role);
            } else {
              throw new Error('คุณไม่มีสิทธิ์เข้าถึงระบบแอดมิน');
            }
          }
        }),
        catchError((err) => {
          console.error('Login error:', err);
          throw err;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn() {
    return !!this.getToken();
  }
}
