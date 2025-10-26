import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbar } from '../admin-navbar/admin-navbar';

interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

interface Transaction {
  user?: User;
  type: 'topup' | 'purchase'; // แทน description
  amount: number;
  date: string;
}

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [
    AdminNavbar,
    FormsModule,
    CommonModule,
    DatePipe,
    DecimalPipe,
    RouterModule,
  ],
  templateUrl: './admin-transactions.html',
  styleUrls: ['./admin-transactions.scss'],
})
export class AdminTransactions {
  users: User[] = [];
  selectedUserId: number | null = null;
  transactions: Transaction[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers() {
    const token = localStorage.getItem('token');
    if (!token) return console.error('No token found');

    this.http
      .get<User[]>(`${environment.apiUrl}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          // filter เฉพาะ user
          this.users = res.filter((u) => u.role === 'user');
        },
        error: (err) => console.error('Load users error', err),
      });
  }

  onUserChange(userIdStr: string) {
    const userId = Number(userIdStr);
    this.selectedUserId = userId;
    this.transactions = [];

    if (!userId) return;

    const token = localStorage.getItem('token');
    if (!token) return console.error('No token found');

    this.http
      .get<Transaction[]>(`${environment.apiUrl}/wallet/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => (this.transactions = res),
        error: (err) => console.error('Load transactions error', err),
      });
  }
}
