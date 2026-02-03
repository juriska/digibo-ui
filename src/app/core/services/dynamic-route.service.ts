import { Injectable, signal, computed } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { FEATURE_ROUTES, FeatureRouteConfig } from '../config/route-config';

/**
 * Navigation item derived from registered routes
 */
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: string[];
}

/**
 * Service that dynamically registers routes based on user permissions.
 * Routes are not registered until the user logs in, and are cleared on logout.
 */
@Injectable({
  providedIn: 'root'
})
export class DynamicRouteService {
  private _activeNavItems = signal<NavItem[]>([]);

  /** Navigation items for the currently registered routes */
  activeNavItems = this._activeNavItems.asReadonly();

  constructor(private router: Router) {}

  /**
   * Register routes based on user's roles.
   * Only routes where the user has at least one required role will be registered.
   */
  registerRoutesForRoles(userRoles: string[]): void {
    const allowedFeatures = FEATURE_ROUTES.filter(feature =>
      feature.roles.some(role => userRoles.includes(role))
    );

    const navItems: NavItem[] = allowedFeatures.map(feature => ({
      path: feature.path,
      label: feature.label,
      icon: feature.icon,
      roles: feature.roles
    }));

    this._activeNavItems.set(navItems);

    const featureRoutes: Routes = allowedFeatures.map(feature => ({
      path: feature.path,
      loadChildren: feature.loadChildren
    }));

    const newRoutes: Routes = [
      // Public routes
      {
        path: 'login',
        loadComponent: () => import('../../features/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('../../features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
      // Protected routes
      {
        path: '',
        loadComponent: () => import('../../layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('../../features/dashboard/dashboard.component').then(m => m.DashboardComponent)
          },
          ...featureRoutes
        ]
      },
      // Redirect unknown routes to dashboard
      {
        path: '**',
        redirectTo: ''
      }
    ];

    this.router.resetConfig(newRoutes);
    console.log(`Registered ${allowedFeatures.length} feature routes for user`, allowedFeatures.map(f => f.path));
  }

  /**
   * Clear all feature routes (called on logout).
   * Only public routes remain.
   */
  clearRoutes(): void {
    this._activeNavItems.set([]);

    const publicRoutes: Routes = [
      {
        path: 'login',
        loadComponent: () => import('../../features/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('../../features/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
      {
        path: '**',
        redirectTo: 'login'
      }
    ];

    this.router.resetConfig(publicRoutes);
    console.log('Cleared all feature routes');
  }

  /**
   * Check if a specific route is currently registered
   */
  isRouteRegistered(path: string): boolean {
    return this._activeNavItems().some(item => item.path === path);
  }
}
