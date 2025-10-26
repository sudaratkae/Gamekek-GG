import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth'; 
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  form!: FormGroup;
  error = '';
  fileToUpload: File | null = null;
  successPopup = false; // ใช้ควบคุมป๊อปอัพ
previewImage: any;

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // ตรวจสอบ confirm password
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  previewUrl: string | ArrayBuffer | null = null;

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fileToUpload = file; // ✅ บันทึกไฟล์เพื่อส่ง
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result; // ✅ แสดง preview
    };
    reader.readAsDataURL(file);
  }
}
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // แสดง error
      return;
    }

    const fd = new FormData();
    fd.append('username', this.form.value.username);
    fd.append('email', this.form.value.email);
    fd.append('password', this.form.value.password);
    if (this.fileToUpload) fd.append('profile_image', this.fileToUpload);

    this.auth.register(fd).subscribe({
      next: () => this.successPopup = true, // เปิดป๊อปอัพ
      error: e => this.error = e.error?.message || 'Register failed'
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
