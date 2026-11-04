import { Routes } from '@angular/router';
import { PortfolioComponent } from './features/portfolio/portfolio.component';
import { AdminLoginComponent } from './features/admin/login/admin-login.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Sitio público
  {
    path: '',
    component: PortfolioComponent,
    title: 'Nicolás Lintz — Ingeniero en Informática & Full Stack Developer'
  },

  // Área administrativa (CMS)
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    title: 'Login CMS — Portafolio Nicolás Lintz'
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    title: 'Dashboard CMS — Nicolás Lintz'
  },

  // Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
