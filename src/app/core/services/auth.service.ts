import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject, catchError, of } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { DynamicRouteService } from './dynamic-route.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive state
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);

  isAuthenticated = this._isAuthenticated.asReadonly();
  user = this._user.asReadonly();

  // Computed signals for role checks
  userRoles = computed(() => this._user()?.roles || []);
  userPermissions = computed(() => this._user()?.permissions || []);

  private dynamicRouteService = inject(DynamicRouteService);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize auth state by checking if user has valid session (cookie-based)
   */
  private initializeAuth(): void {
    // Check if user has valid session by calling /me endpoint
    // The httpOnly cookie will be sent automatically
    this.http.get<any>(`${this.API_URL}/me`, { withCredentials: true })
      .pipe(
        catchError(() => of(null))
      )
      .subscribe(response => {
        if (response && response.username) {
          const user: User = {
            userId: response.userId,
            username: response.username,
            roles: response.roles || [],
            permissions: Array.isArray(response.permissions)
              ? response.permissions
              : Array.from(response.permissions || [])
          };
          this.setUser(user);
        } else {
          this.clearAuth();
        }
      });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/login`,
      { username, password },
      { withCredentials: true } // Important: send/receive cookies
    ).pipe(
      tap(response => {
        // Token is in httpOnly cookie, user info is in response body
        const user: User = {
          userId: response.userId,
          username: response.username,
          roles: response.roles || [],
          permissions: response.permissions
            ? (Array.isArray(response.permissions) ? response.permissions : Array.from(response.permissions))
            : []
        };
        this.setUser(user);
      })
    );
  }

  logout(): void {
    // Call backend to clear cookies
    this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.clearAuth();
        this.router.navigate(['/login']);
      });
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        const user: User = {
          userId: response.userId,
          username: response.username,
          roles: response.roles || [],
          permissions: response.permissions
            ? (Array.isArray(response.permissions) ? response.permissions : Array.from(response.permissions))
            : []
        };
        this.setUser(user);
      })
    );
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const roles = this._user()?.roles || [];
    return roles.includes(role) || roles.includes(`ROLE_${role}`);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  /**
   * Check if user has a specific permission (for PL/SQL procedure access)
   */
  hasPermission(permission: string): boolean {
    const permissions = this._user()?.permissions || [];
    return permissions.includes(permission.toUpperCase());
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(perm => this.hasPermission(perm));
  }

  private clearAuth(): void {
    this._isAuthenticated.set(false);
    this._user.set(null);
    this.currentUserSubject.next(null);
    // Clear all feature routes
    this.dynamicRouteService.clearRoutes();
  }

  private setUser(user: User): void {
    this._isAuthenticated.set(true);
    this._user.set(user);
    this.currentUserSubject.next(user);
    // Register routes based on user's roles
    this.dynamicRouteService.registerRoutesForRoles(user.roles);
  }
}
