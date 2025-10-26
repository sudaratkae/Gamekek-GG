import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  private purchasedGames: number[] = [];

  constructor() {
    const saved = localStorage.getItem('purchasedGames');
    if (saved) this.purchasedGames = JSON.parse(saved);
  }

  loadPurchasedGames(games: number[]) {
    this.purchasedGames = games;
    localStorage.setItem('purchasedGames', JSON.stringify(this.purchasedGames));
  }

  isGamePurchased(gameId: number): boolean {
    return this.purchasedGames.includes(gameId);
  }

  addPurchasedGame(gameId: number) {
    if (!this.isGamePurchased(gameId)) {
      this.purchasedGames.push(gameId);
      localStorage.setItem(
        'purchasedGames',
        JSON.stringify(this.purchasedGames)
      );
    }
  }
}
