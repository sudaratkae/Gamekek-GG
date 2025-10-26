import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // ✅ ต้อง import
import { UserToolbar } from '../shared/user-toolbar/user-toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../app/services/game';
import { LibraryService } from '../app/services/library.service';
import { PurchaseCartService } from '../app/services/purchase-cart.service';

export interface Game {
  id: number;
  title: string;
  price: number;
  image_url: string;
  description?: string;
  category_name?: string;
  release_date?: string;
  rank?: number;
}

@Component({
  selector: 'app-game-library',
  standalone: true, // ✅ ต้องระบุ standalone
  imports: [UserToolbar, CommonModule],
  templateUrl: './game-library.html',
  styleUrls: ['./game-library.scss'], // แก้จาก styleUrl เป็น styleUrls
})
export class GameLibrary {
  gameData: Game | null = null;
  isPurchased: boolean = false;

  private cartService = inject(PurchaseCartService);
  private libraryService = inject(LibraryService);
  private location = inject(Location); // ✅ แก้ตรงนี้
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private router = inject(Router);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.isPurchased = this.libraryService.isGamePurchased(id);

      this.gameService.getGame(id).subscribe({
        next: (res: Game) => {
          this.gameData = res;

          if (!this.isPurchased && this.router.url.startsWith('/library')) {
            this.router.navigate(['/game', id]);
          }
        },
        error: (err: any) => {
          console.error('ไม่สามารถโหลดข้อมูลเกมได้', err);
        },
      });
    }
  }

  goBack(): void {
    this.location.back(); // ✅ ใช้งานได้เลย
  }
}
