import { Route } from '@angular/router';

/**
 * Configuration for a feature route that can be dynamically registered
 */
export interface FeatureRouteConfig {
  /** Route path (e.g., 'orders', 'payments') */
  path: string;
  /** Display label for navigation */
  label: string;
  /** Icon for navigation */
  icon: string;
  /** Required roles (user needs ANY of these) */
  roles: string[];
  /** Lazy load function for the feature routes */
  loadChildren: () => Promise<Route[]>;
}

/**
 * All available feature routes with their role requirements.
 * Routes are registered dynamically based on user permissions.
 */
export const FEATURE_ROUTES: FeatureRouteConfig[] = [
  {
    path: 'orders',
    label: 'Orders',
    icon: '📦',
    roles: ['RBOFFORDERS'],
    loadChildren: () => import('../../features/orders/orders.routes').then(m => m.ORDERS_ROUTES)
  },
  {
    path: 'payments',
    label: 'Payments',
    icon: '💳',
    roles: ['RBOPAYMENT', 'RBOPAYMENTVIEW'],
    loadChildren: () => import('../../features/payments/payments.routes').then(m => m.PAYMENTS_ROUTES)
  }
];
