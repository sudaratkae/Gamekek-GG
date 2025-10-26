import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AdminNavbar } from '../admin-navbar/admin-navbar';
import { RouterModule } from '@angular/router';
import { GameService } from '../../app/services/game';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AdminNavbar,
    RouterModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboard implements OnInit {
  games: any[] = [];
  categories: any[] = [];

  // ฟอร์ม
  editGameId: number | null = null;
  title = '';
  description = '';
  categoryId: number | null = null;
  price: number | null = null;
  file: File | null = null;

  currentImageUrl: string | null = null; // รูปเดิม
  filePreview: string | null = null; // preview ของไฟล์ใหม่

  // modal
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  showDeleteModal = false;
  deleteGameId: number | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadGames();
    this.loadCategories();
  }

  loadGames() {
    this.gameService.getGames().subscribe({
      next: (data) => (this.games = data),
      error: (err) => console.error(err),
    });
  }

  loadCategories() {
    this.gameService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error(err),
    });
  }

  // เลือกไฟล์
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = e.target.result;
      };
      reader.readAsDataURL(this.file);
    } else {
      this.filePreview = null;
    }
  }

  // โหลดเกมสำหรับแก้ไข
  loadGameForEdit() {
    if (!this.editGameId) return;
    const game = this.games.find((g) => g.id === this.editGameId);
    if (game) {
      this.title = game.title;
      this.description = game.description;
      this.categoryId = game.category_id;
      this.price = game.price;
      this.file = null;
      this.filePreview = null;
      this.currentImageUrl = game.image_url || null; // แสดงรูปเดิม
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('category_id', this.categoryId!.toString());
    formData.append('price', this.price!.toString());
    if (this.file) formData.append('image', this.file);

    if (this.editGameId) {
      // แก้ไขเกม
      this.gameService.updateGame(this.editGameId, formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadGames();
        },
        error: (err) => console.error(err),
      });
    } else {
      // เพิ่มเกม
      this.gameService.addGame(formData).subscribe({
        next: () => {
          this.resetForm();
          this.loadGames();
        },
        error: (err) => console.error(err),
      });
    }
  }

  // modal เพิ่ม/แก้ไข
  openModal(mode: 'add' | 'edit') {
    this.modalMode = mode;
    this.showModal = true;
    if (mode === 'add') this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  // modal ลบ
  openDeleteModal() {
    this.showDeleteModal = true;
    this.deleteGameId = null;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.deleteGameId = null;
  }

  confirmDelete() {
    if (!this.deleteGameId) {
      alert('กรุณาเลือกเกมที่จะลบ');
      return;
    }
    if (!confirm('คุณแน่ใจว่าต้องการลบเกมนี้จริง ๆ?')) return;

    this.gameService.deleteGame(this.deleteGameId).subscribe({
      next: () => {
        this.loadGames();
        this.closeDeleteModal();
      },
      error: (err) => console.error(err),
    });
  }

  // รีเซ็ตฟอร์ม
  resetForm() {
    this.editGameId = null;
    this.title = '';
    this.description = '';
    this.categoryId = null;
    this.price = null;
    this.file = null;
    this.filePreview = null;
    this.currentImageUrl = null;
  }
}
