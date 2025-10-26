import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

export interface Game {
  id: number;
  game_id?: number; // map จาก DB
  title: string;
  price: number;
  image: string;
  description?: string;
  category_name?: string;
  release_date?: string;
  rank?: number;
  owned?: boolean; // ใช้สำหรับตรวจสอบว่าซื้อแล้ว
}

@Injectable({ providedIn: 'root' })
export class PurchaseCartService {
  private http = inject(HttpClient);
  private cartItems: Game[] = [];

  // --- โหลดตะกร้าจาก Backend ---
  async loadCart(): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/cart`, this.getHeaders())
      );
      this.cartItems = (res.items || []).map((item: any) => ({
        ...item,
        game_id: item.id,
      }));
    } catch (err) {
      console.error('ไม่สามารถโหลดตะกร้าได้', err);
      this.cartItems = [];
    }
  }

  getCart(): Observable<Game[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Game[]>(`${environment.apiUrl}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // --- เพิ่มเกมลงตะกร้า ---
  addToCart(gameId: number) {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${environment.apiUrl}/cart/add`,
      { game_id: gameId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // --- ลบเกมออกจากตะกร้า ---
  removeFromCart(gameId: number): Observable<any> {
    return this.http.post(
      `${environment.apiUrl}/cart/remove`,
      { gameId },
      this.getHeaders()
    );
  }

  // --- เคลียร์ตะกร้า (หลังซื้อสำเร็จ) ---
  clearCart() {
    this.cartItems = [];
  }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    };
  }
}
