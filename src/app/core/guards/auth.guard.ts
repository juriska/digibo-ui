import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard that checks if user is authenticated
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Guard that checks if user has required roles
 * Usage in routes:
 *   canActivate: [roleGuard],
 *   data: { roles: ['RBOFFORDERS'] }
 *
 * Or for multiple roles (OR logic):
 *   data: { roles: ['RBOPAYMENT', 'RBOPAYMENTVIEW'] }
 */
export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check authentication
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Get required roles from route data
  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  // If no roles required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has ANY of the required roles (OR logic)
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // User doesn't have required role - redirect to unauthorized page
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Guard that checks if user has ALL required roles (AND logic)
 * Usage: data: { roles: ['ROLE1', 'ROLE2'], requireAll: true }
 */
export const allRolesGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (authService.hasAllRoles(requiredRoles)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
