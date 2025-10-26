export interface User {
  id: string;               // รหัสผู้ใช้จากฐานข้อมูล
  username: string;         // ชื่อผู้ใช้
  email: string;            // อีเมล
  profile_image?: string;    // URL หรือ base64 ของรูปโปรไฟล์
  balance?: number;          // ยอดเงิน (optional)
  role: 'user' | 'admin';   // บทบาทผู้ใช้
}