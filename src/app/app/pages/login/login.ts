import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  form!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ ส่วนนี้จะทำงานทันทีเมื่อเปิดหน้า login
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // ถ้ามี token อยู่แล้ว ให้ข้ามหน้า login ไปหน้า dashboard/profile ทันที
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/store-main']); // ✅ redirect user ไปหน้า store-main
      }
      return; // ✅ หยุดไม่ต้องสร้าง form อีก
    }

    // ✅ ถ้ายังไม่มี token ให้แสดงฟอร์ม login ตามปกติ
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.login(this.form.value.email, this.form.value.password).subscribe({
      next: () => this.router.navigate(['/profile']), // ✅ หน้าเริ่มต้นหลัง login
      error: (e) => (this.error = e.error?.message || 'Login failed'),
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
