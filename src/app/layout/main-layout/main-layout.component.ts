import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DynamicRouteService } from '../../core/services/dynamic-route.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="logo">
          <h2>DigiBo</h2>
        </div>

        <nav class="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <span class="nav-icon">🏠</span>
            <span>Dashboard</span>
          </a>

          <!-- Dynamic navigation items based on registered routes -->
          <a *ngFor="let navItem of dynamicRouteService.activeNavItems()"
             [routerLink]="'/' + navItem.path"
             routerLinkActive="active"
             class="nav-item">
            <span class="nav-icon">{{ navItem.icon }}</span>
            <span>{{ navItem.label }}</span>
            <span class="role-tag">{{ navItem.roles[0] }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" *ngIf="authService.isAuthenticated()">
            <div class="user-avatar">{{ userInitial }}</div>
            <div class="user-details">
              <span class="user-name">{{ authService.user()?.username }}</span>
              <span class="user-roles">{{ userRolesDisplay }}</span>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="header">
          <div class="header-title">
            <h1>DigiBo Backoffice</h1>
          </div>
          <div class="header-actions">
            <span class="user-badge" *ngIf="authService.isAuthenticated()">
              {{ authService.user()?.username }}
            </span>
          </div>
        </header>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: #1a1a2e;
      color: white;
      display: flex;
      flex-direction: column;
    }

    .logo {
      padding: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .logo h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #4fc3f7;
    }

    .nav-menu {
      flex: 1;
      padding: 20px 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      transition: all 0.2s;
      gap: 12px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .nav-item.active {
      background: rgba(79, 195, 247, 0.2);
      color: #4fc3f7;
      border-left: 3px solid #4fc3f7;
    }

    .nav-icon {
      font-size: 18px;
    }

    .role-tag {
      margin-left: auto;
      font-size: 10px;
      padding: 2px 6px;
      background: rgba(76, 175, 80, 0.3);
      color: #81c784;
      border-radius: 4px;
    }

    .role-tag.view {
      background: rgba(33, 150, 243, 0.3);
      color: #64b5f6;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: #4fc3f7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #1a1a2e;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      font-size: 14px;
    }

    .user-roles {
      font-size: 11px;
      color: rgba(255,255,255,0.5);
    }

    .logout-btn {
      width: 100%;
      padding: 10px;
      background: rgba(244, 67, 54, 0.2);
      color: #ef5350;
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: rgba(244, 67, 54, 0.3);
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }

    .header {
      height: 64px;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }

    .header-title h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .user-badge {
      padding: 6px 12px;
      background: #e3f2fd;
      color: #1565c0;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }

    .content {
      flex: 1;
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  dynamicRouteService = inject(DynamicRouteService);

  get userInitial(): string {
    const username = this.authService.user()?.username || '';
    return username.charAt(0).toUpperCase();
  }

  get userRolesDisplay(): string {
    const roles = this.authService.user()?.roles || [];
    return roles.slice(0, 2).join(', ') + (roles.length > 2 ? '...' : '');
  }

  logout(): void {
    this.authService.logout();
  }
}
