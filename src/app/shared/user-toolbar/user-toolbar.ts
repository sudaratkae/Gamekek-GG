import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../app/services/user';
import { HttpClientModule } from '@angular/common/http';
import { WalletService } from '../../app/services/wallet.service';

@Component({
  selector: 'app-user-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './user-toolbar.html',
  styleUrls: ['./user-toolbar.scss'],
})
export class UserToolbar implements OnInit {
  currentUser?: User;
  balance: number = 0;

  @Input() title: string = 'GameKek';

  constructor(
    private userService: UserService,
    private router: Router,
    private walletService: WalletService
  ) {} // ใช้ userService จริง

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      this.currentUser = user;
    });
    this.loadBalance();
  }
  loadBalance() {
    this.walletService.getBalance().subscribe({
      next: (res) => {
        this.balance = res.balance;
      },
      error: (err) => {
        console.error('Failed to load balance', err);
        this.balance = 0;
      },
    });
  }

  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.dropdownOpen = false;
    this.router.navigate(['/login']); // ใช้ router navigate แทน window.location
  }
}
