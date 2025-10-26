import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { UserToolbar } from '../../../shared/user-toolbar/user-toolbar';
import { PurchaseCartService } from '../../services/purchase-cart.service';
import { GameService } from '../../services/game';
import { LibraryService } from '../../services/library.service';

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
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, UserToolbar, RouterModule],
  templateUrl: './game-detail.html',
  styleUrls: ['./game-detail.scss'],
})
export class GameDetail implements OnInit {
  gameData: Game | null = null;
  isPurchased: boolean = false;
  private cartService = inject(PurchaseCartService);
  private libraryService = inject(LibraryService);
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // ใช้เช็กเกมซื้อแล้ว
      this.isPurchased = this.libraryService.isGamePurchased(id);

      this.gameService.getGame(id).subscribe({
        next: (res: Game) => {
          this.gameData = res;

          // ถ้าเปิดจาก Library แต่เกมยังไม่ได้ซื้อ ให้ redirect ไปหน้า Game Detail ปกติ
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
    this.location.back();
  }

  addToCart(): void {
    if (!this.gameData || this.isPurchased) return; // ป้องกันเพิ่มเกมที่ซื้อแล้ว

    this.cartService.addToCart(this.gameData.id).subscribe({
      next: () => {
        const goToPurchase = confirm(
          `${
            this.gameData!.title
          } ถูกเพิ่มไปที่ตะกร้าแล้ว\n\nคุณต้องการไปหน้าตะกร้าหรือไม่?`
        );
        if (goToPurchase) this.router.navigate(['/purchase']);
      },
      error: (err) => {
        console.error('เพิ่มเกมลงตะกร้าไม่สำเร็จ', err);
        alert('ไม่สามารถเพิ่มเกมลงตะกร้าได้');
      },
    });
  }
}
