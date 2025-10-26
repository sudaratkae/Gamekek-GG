import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GameService } from '../../services/game';
import { UserToolbar } from '../../../shared/user-toolbar/user-toolbar';

interface Game {
  id: number;
  title: string;
  category_name: string;
  price: number;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-store-main',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    UserToolbar,
  ],
  templateUrl: './store-main.html',
  styleUrls: ['./store-main.scss'],
})
export class StoreMain implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  categories: Category[] = [];

  searchText = '';
  selectedCategory = '';

  constructor(private gameService: GameService, private router: Router) {}

  ngOnInit() {
    this.loadGames();
    this.loadCategories();
  }

  loadGames() {
    this.gameService.getGames().subscribe({
      next: (data: Game[]) => {
        this.games = data;
        this.filteredGames = data;
      },
      error: (err: any) => console.error(err),
    });
  }

  loadCategories() {
    this.gameService.getCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: (err: any) => console.error(err),
    });
  }

  filterGames() {
    this.filteredGames = this.games.filter((g) => {
      const matchesText = g.title
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? g.category_name === this.selectedCategory
        : true;
      return matchesText && matchesCategory;
    });
  }

  goToGameDetails(gameId: number) {
    this.router.navigate(['/game', gameId]);
  }
}
