import { Routes } from '@angular/router';
import { Register } from './app/pages/register/register';
import { Login } from './app/pages/login/login';
import { Profile } from './app/pages/profile/profile';
import { Admin } from './app/pages/admin/admin';
import { AdminGuard } from './guards/admin-guard';
import { AuthGuard } from './guards/auth-guard';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { StoreMain } from './app/pages/store-main/store-main';
import { GameDetail } from './app/pages/game-detail/game-detail';
import { AdminTransactions } from './admin/admin-transactions/admin-transactions';
import { DiscountManagement } from './discount-management/discount-management';
import { PurchaseGameComponent } from './app/purchase-game/purchase-game';
import { library } from './library/library';
import { GameLibrary } from './game-library/game-library';
import { RankingComponent } from './ranking/ranking';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // redirect หน้าแรกไป register
  { path: 'register', component: Register }, // route สำหรับ register
  { path: 'login', component: Login }, // ✅ เพิ่ม route login
  { path: 'profile', component: Profile, canActivate: [AuthGuard] }, // ✅ ต้องล็อกอินก่อน
  { path: 'admin/login', component: Admin }, // login admin
  {
    path: 'admin/dashboard',
    component: AdminDashboard,
    canActivate: [AdminGuard],
  },
  { path: 'discounts', component: DiscountManagement },
  { path: 'purchase', component: PurchaseGameComponent },
  { path: 'store-main', component: StoreMain },
  { path: 'library', component: library },
  { path: 'gamelibary/:id', component: GameLibrary },
  { path: 'game/:id', component: GameDetail },
  { path: 'ranking', component: RankingComponent },
  {
    path: 'transactions',
    component: AdminTransactions, // เรียกใช้งาน standalone component
  },
  {
    path: 'purchase',
    loadComponent: () =>
      import('./app/purchase-game/purchase-game').then(
        (m) => m.PurchaseGameComponent
      ),
  },
];
