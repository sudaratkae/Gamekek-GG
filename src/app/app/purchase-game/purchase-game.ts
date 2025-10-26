import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PurchaseCartService, Game } from '../services/purchase-cart.service';
import { WalletService } from '../services/wallet.service';
import { UserToolbar } from '../../shared/user-toolbar/user-toolbar';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface Discount {
  id: number;
  code: string;
  discount_percent: number;
}

@Component({
  selector: 'app-purchase-game',
  standalone: true,
  imports: [CommonModule, RouterModule, UserToolbar, FormsModule],
  templateUrl: './purchase-game.html',
  styleUrls: ['./purchase-game.scss'],
})
export class PurchaseGameComponent implements OnInit {
  cartService = inject(PurchaseCartService);
  walletService = inject(WalletService);
  http = inject(HttpClient);

  cartItems: Game[] = [];
  discountCode = '';
  discountAmount = 0;
  walletBalance: number = 0;
  availableDiscounts: Discount[] = [];
  selectedDiscount: Discount | null = null;
  usedDiscounts: string[] = []; // โค้ดที่ผู้ใช้เคยใช้

  ngOnInit() {
    this.loadWallet();
    this.loadCart();
    this.loadAvailableDiscounts();
  }
  async loadAvailableDiscounts() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/user/discounts`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      this.availableDiscounts = res;
    } catch (err) {
      console.error('โหลดโค้ดส่วนลดไม่สำเร็จ', err);
      this.availableDiscounts = [];
    }
  }

  // เลือกโค้ดส่วนลด
  selectDiscount(discount: Discount) {
    if (this.usedDiscounts.includes(discount.code)) {
      alert('โค้ดนี้คุณใช้ไปแล้ว');
      return;
    }
    this.selectedDiscount = discount;
    this.discountCode = discount.code;
    this.calculateDiscount();
  }

  // ลบโค้ดส่วนลด
  clearDiscount() {
    this.selectedDiscount = null;
    this.discountCode = '';
    this.discountAmount = 0;
  }

  // คำนวณส่วนลดตามโค้ด
  calculateDiscount() {
    if (!this.selectedDiscount) {
      this.discountAmount = 0;
      return;
    }
    this.discountAmount =
      this.totalPrice * (this.selectedDiscount.discount_percent / 100);
  }

  // รวมราคาสินค้าทั้งหมด
  get totalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + +item.price, 0);
  }

  // ราคาสุทธิหลังหักส่วนลด
  get finalPrice(): number {
    return this.totalPrice - this.discountAmount;
  }

  // เมื่อผู้ใช้ใส่โค้ดส่วนลด
  async applyDiscount() {
    if (!this.discountCode.trim()) {
      this.discountAmount = 0;
      return;
    }

    try {
      const res: any = await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/user/discounts/validate`,
          { discountCode: this.discountCode },
          this.getHeaders()
        )
      );

      if (res.valid) {
        this.discountAmount = this.totalPrice * (res.discount_percent / 100);
        alert(`โค้ดถูกต้อง! ลด ${res.discount_percent}%`);
      } else {
        this.discountAmount = 0;
        alert(res.message || 'โค้ดไม่ถูกต้องหรือหมดอายุ');
      }
    } catch (err) {
      console.error(err);
      this.discountAmount = 0;
      alert('ตรวจสอบโค้ดไม่สำเร็จ');
    }
  }

  // (ใน Component ที่คุณมีเมธอด loadCart() อยู่แล้ว)

  removeFromCart(gameId: number) {
    const confirmDelete = confirm('คุณต้องการลบเกมนี้ออกจากตะกร้าจริงหรือไม่?');
    if (!confirmDelete) return;

    this.cartService.removeFromCart(gameId).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.loadCart(); // ✅ โหลดใหม่จาก DB เพื่อ sync UI
      },
      error: (err: any) => {
        console.error(err);
        alert(err.error?.error || 'ไม่สามารถลบเกมได้');
      },
    });
  }

  // คุณต้องมีเมธอด loadCart() นี้อยู่แล้ว (จากโค้ดเดิมที่คุณส่งมา)
  loadCart() {
    this.cartService.getCart().subscribe({
      next: (games: Game[]) => {
        this.cartItems = games;
        this.calculateDiscount(); // รีคำนวณส่วนลดด้วย (ถ้ามี)
      },
      error: (err) => {
        console.error('โหลดตะกร้าไม่สำเร็จ', err);
      },
    });
  }

  async loadWallet() {
    try {
      const res: any = await firstValueFrom(this.walletService.getBalance());
      this.walletBalance = res.balance;
    } catch (err) {
      console.error('ไม่สามารถโหลดยอดเงินได้', err);
    }
  }

  async checkout() {
    if (!this.cartItems.length) {
      alert('ไม่มีเกมในตะกร้า');
      return;
    }

    try {
      const res: any = await firstValueFrom(
        this.http.post(
          `${environment.apiUrl}/shop/purchase`,
          { discountCode: this.discountCode.trim() || null },
          this.getHeaders()
        )
      );

      alert(`ซื้อเกมสำเร็จ! ยอดเงินคงเหลือ: $${res.balance}`);
      this.walletBalance = res.balance;
      this.discountCode = '';
      this.discountAmount = 0;
      this.cartService.clearCart();
      this.loadCart(); // รีโหลดตะกร้าให้ว่าง
    } catch (err: any) {
      console.error(err);
      alert(err.error?.error || 'ซื้อเกมไม่สำเร็จ');
    }
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }
  goBack() {
    history.back();
  }
  getImageUrl(image: string): string {
    if (!image) return 'assets/no-image.png';
    return `https://gamekek.onrender.com/uploads/games/${image}`;
  }
}
