import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Initial routes configuration.
 * Feature routes are registered dynamically by DynamicRouteService after login.
 */
export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Protected routes (require authentication)
  // Feature routes are added dynamically based on user permissions
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      }
      // Feature routes (orders, payments, etc.) are registered dynamically by DynamicRouteService
    ]
  },

  // Redirect unknown routes to dashboard
  {
    path: '**',
    redirectTo: ''
  }
];
