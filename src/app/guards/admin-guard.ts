import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../app/services/auth';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.getRole() !== 'admin') {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}