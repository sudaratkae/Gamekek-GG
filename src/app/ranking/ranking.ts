import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RankingService } from '../app/services/ranking';
import { AdminNavbar } from '../admin/admin-navbar/admin-navbar';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, DecimalPipe, AdminNavbar],
  templateUrl: './ranking.html',
  styleUrls: ['./ranking.scss'],
})
export class RankingComponent implements OnInit {
  rankings: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(private rankingService: RankingService) {}

  ngOnInit(): void {
    this.loadRankings();
  }

  loadRankings(): void {
    this.rankingService.getRankings().subscribe({
      next: (data) => {
        this.rankings = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading rankings', err);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลได้';
        this.loading = false;
      },
    });
  }
}
