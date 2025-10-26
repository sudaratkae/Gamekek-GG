import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { UserToolbar } from '../shared/user-toolbar/user-toolbar';

interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  owned?: boolean; // ✅ เพิ่ม flag ว่าเป็นเกมที่ซื้อแล้ว
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserToolbar],
  templateUrl: './library.html',
  styleUrls: ['./library.scss'],
})
export class library implements OnInit {
  http = inject(HttpClient);
  router = inject(Router);

  library: Game[] = [];
  filteredGames: Game[] = [];
  searchText: string = '';
  cart: number[] = []; // เก็บ id เกมที่อยู่ในตะกร้า

  ngOnInit() {
    this.loadLibrary();
  }

  async loadLibrary() {
    try {
      const res: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}/library`, this.getHeaders())
      );
      // mark owned game
      this.library = res.map((g: Game) => ({
        ...g,
        owned: g.owned || false,
      }));
      this.filteredGames = [...this.library];
    } catch (err) {
      console.error(err);
      this.library = [];
      this.filteredGames = [];
    }
  }

  filterGames() {
    const text = this.searchText.toLowerCase();
    this.filteredGames = this.library.filter((g) =>
      g.title.toLowerCase().includes(text)
    );
  }

  goToGameDetails(gameId: number) {
    this.router.navigate(['/gamelibary', gameId]);
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getImageUrl(image: string) {
    if (!image) return 'assets/no-image.png';
    return `http://localhost:5000/uploads/games/${image}`;
  }
}
