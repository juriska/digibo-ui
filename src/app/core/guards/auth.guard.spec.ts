import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard, roleGuard, allRolesGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('Auth Guards', () => {
  let authServiceSpy: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    hasAnyRole: ReturnType<typeof vi.fn>;
    hasAllRoles: ReturnType<typeof vi.fn>;
  };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceSpy = {
      isAuthenticated: vi.fn(),
      hasAnyRole: vi.fn(),
      hasAllRoles: vi.fn(),
    };
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  function runGuard(guard: any, routeData: Record<string, any> = {}): boolean {
    const route = { data: routeData } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => guard(route, state));
  }

  describe('authGuard', () => {
    it('should allow access when authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      expect(runGuard(authGuard)).toBe(true);
    });

    it('should redirect to /login when not authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      expect(runGuard(authGuard)).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('roleGuard', () => {
    it('should redirect to /login when not authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      expect(runGuard(roleGuard, { roles: ['ADMIN'] })).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should allow access when no roles are required', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      expect(runGuard(roleGuard, {})).toBe(true);
    });

    it('should allow access when roles array is empty', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      expect(runGuard(roleGuard, { roles: [] })).toBe(true);
    });

    it('should allow access when user has any required role', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      authServiceSpy.hasAnyRole.mockReturnValue(true);
      expect(runGuard(roleGuard, { roles: ['RBOFFORDERS'] })).toBe(true);
    });

    it('should redirect to /unauthorized when user lacks required roles', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      authServiceSpy.hasAnyRole.mockReturnValue(false);
      expect(runGuard(roleGuard, { roles: ['RBOADMIN'] })).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });

  describe('allRolesGuard', () => {
    it('should redirect to /login when not authenticated', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(false);
      expect(runGuard(allRolesGuard, { roles: ['A', 'B'] })).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should allow access when no roles required', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      expect(runGuard(allRolesGuard, {})).toBe(true);
    });

    it('should allow access when user has all required roles', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      authServiceSpy.hasAllRoles.mockReturnValue(true);
      expect(runGuard(allRolesGuard, { roles: ['A', 'B'] })).toBe(true);
    });

    it('should redirect to /unauthorized when user is missing a role', () => {
      authServiceSpy.isAuthenticated.mockReturnValue(true);
      authServiceSpy.hasAllRoles.mockReturnValue(false);
      expect(runGuard(allRolesGuard, { roles: ['A', 'B'] })).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
    });
  });
});
