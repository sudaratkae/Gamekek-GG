import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../app/services/auth'; // import service

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.html',
  styleUrls: ['./admin-navbar.scss'],
})
export class AdminNavbar {
  currentRoute: string = '';

  constructor(private router: Router, private auth: Auth) {
    this.currentRoute = window.location.pathname;
  }

  isAdminLoggedIn(): boolean {
    const role = this.auth.getRole();
    return this.auth.isLoggedIn() && role === 'admin';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); // รีไดเร็กไป login
  }
}
