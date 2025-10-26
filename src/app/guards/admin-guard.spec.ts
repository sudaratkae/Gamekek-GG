import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing'; // อาจต้อง Import เพิ่ม

// 1. นำเข้า Class Guard
import { AdminGuard } from './admin-guard';

describe('AdminGuard', () => {
  let guard: AdminGuard; // ประกาศตัวแปรสำหรับ Class Guard

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminGuard], // ต้องใส่ใน providers
    });
    // 2. Inject Guard เข้ามา
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    // 3. ทดสอบว่าสร้างอ็อบเจกต์ได้
    expect(guard).toBeTruthy();
  });

  // ... เพิ่ม Test cases อื่นๆ ที่ใช้ guard.canActivate(...)
});

// ลบโค้ดส่วน CanActivateFn (บรรทัดที่ 7-10) ออกไป
