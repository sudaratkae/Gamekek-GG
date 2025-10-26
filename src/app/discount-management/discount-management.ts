import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AdminNavbar } from '../admin/admin-navbar/admin-navbar';

interface Discount {
  id: number;
  code: string;
  discount_percent: number;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
}

@Component({
  selector: 'app-discount-management',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminNavbar, FormsModule],
  templateUrl: './discount-management.html',
  styleUrls: ['./discount-management.scss'],
})
export class DiscountManagement implements OnInit {
  http = inject(HttpClient);

  discounts: Discount[] = [];

  // form สำหรับเพิ่ม/แก้ไข
  discountForm = {
    code: '',
    discount_percent: 0,
    max_uses: 1,
    expires_at: '',
  };

  editingDiscount: Discount | null = null; // สำหรับแก้ไข

  ngOnInit() {
    this.loadDiscounts();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  async loadDiscounts() {
    try {
      const res = await this.http
        .get<Discount[]>(`${environment.apiUrl}/discounts`, this.getHeaders())
        .toPromise();
      this.discounts = res ?? [];
    } catch (err) {
      console.error(err);
      alert('โหลดโค้ดส่วนลดไม่สำเร็จ');
      this.discounts = [];
    }
  }

  // --- สร้างโค้ดใหม่ ---
  async createDiscount() {
    try {
      await this.http
        .post(
          `${environment.apiUrl}/discounts`,
          this.discountForm,
          this.getHeaders()
        )
        .toPromise();
      alert('สร้างโค้ดสำเร็จ');
      this.resetForm();
      this.loadDiscounts();
    } catch (err: any) {
      console.error(err);
      alert(err.error?.error || 'สร้างโค้ดไม่สำเร็จ');
    }
  }

  // --- ลบโค้ด ---
  async deleteDiscount(id: number) {
    if (!confirm('ยืนยันลบโค้ดส่วนลดนี้?')) return;
    try {
      await this.http
        .delete(`${environment.apiUrl}/discounts/${id}`, this.getHeaders())
        .toPromise();
      alert('ลบโค้ดสำเร็จ');
      this.loadDiscounts();
    } catch (err) {
      console.error(err);
      alert('ลบโค้ดไม่สำเร็จ');
    }
  }

  // --- เริ่มแก้ไข ---
  startEdit(discount: Discount) {
    this.editingDiscount = { ...discount };
    this.discountForm = {
      code: discount.code,
      discount_percent: discount.discount_percent,
      max_uses: discount.max_uses,
      expires_at: discount.expires_at ?? '', // ถ้าเป็น null ให้เป็น ''
    };
  }

  // --- ยกเลิกแก้ไข ---
  cancelEdit() {
    this.editingDiscount = null;
    this.resetForm();
  }

  // --- บันทึกการแก้ไข ---
  async saveEdit() {
    if (!this.editingDiscount) return;
    try {
      await this.http
        .put(
          `${environment.apiUrl}/discounts/${this.editingDiscount.id}`,
          this.discountForm,
          this.getHeaders()
        )
        .toPromise();
      alert('แก้ไขโค้ดสำเร็จ');
      this.editingDiscount = null;
      this.resetForm();
      this.loadDiscounts();
    } catch (err: any) {
      console.error(err);
      alert(err.error?.error || 'แก้ไขโค้ดไม่สำเร็จ');
    }
  }

  resetForm() {
    this.discountForm = {
      code: '',
      discount_percent: 0,
      max_uses: 1,
      expires_at: '',
    };
  }
}
