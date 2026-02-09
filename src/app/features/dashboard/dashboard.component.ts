import { Component, inject } from '@angular/core';

import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DynamicRouteService } from '../../core/services/dynamic-route.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="dashboard">
      <div class="welcome-section">
        <h1>Welcome, {{ authService.user()?.username }}!</h1>
        <p>You are logged into DigiBo Backoffice</p>
      </div>
    
      <div class="user-info-card">
        <h3>Your Access</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>User ID</label>
            <span>{{ authService.user()?.userId }}</span>
          </div>
          <div class="info-item">
            <label>Username</label>
            <span>{{ authService.user()?.username }}</span>
          </div>
          <div class="info-item full-width">
            <label>Roles</label>
            <div class="role-list">
              @for (role of authService.user()?.roles; track role) {
                <span class="role-chip">
                  {{ role }}
                </span>
              }
              @if (!authService.user()?.roles?.length) {
                <span class="no-roles">
                  No roles assigned
                </span>
              }
            </div>
          </div>
        </div>
      </div>
    
      <div class="quick-links">
        <h3>Available Modules</h3>
        <div class="module-grid">
          <!-- Dynamic modules based on user permissions -->
          @for (module of dynamicRouteService.activeNavItems(); track module) {
            <div class="module-card accessible"
              >
              <div class="module-icon">{{ module.icon }}</div>
              <div class="module-info">
                <h4>{{ module.label }}</h4>
                <p>{{ getModuleDescription(module.path) }}</p>
                <span class="required-role">Role: {{ module.roles.join(' or ') }}</span>
              </div>
              <a [routerLink]="'/' + module.path" class="module-link">
                Open →
              </a>
            </div>
          }
    
          <!-- Message when no modules available -->
          @if (dynamicRouteService.activeNavItems().length === 0) {
            <div class="no-modules">
              <p>No modules available for your account. Contact your administrator for access.</p>
            </div>
          }
        </div>
      </div>
    </div>
    `,
  styles: [`
    .dashboard {
      padding: 24px;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      margin: 0;
      font-size: 28px;
      color: #1a1a2e;
    }

    .welcome-section p {
      margin: 8px 0 0;
      color: #666;
    }

    .user-info-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 32px;
    }

    .user-info-card h3 {
      margin: 0 0 20px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-item.full-width {
      grid-column: 1 / -1;
    }

    .info-item label {
      font-size: 12px;
      text-transform: uppercase;
      color: #888;
      font-weight: 600;
    }

    .info-item span {
      font-size: 16px;
      color: #333;
    }

    .role-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .role-chip {
      padding: 6px 12px;
      background: #e3f2fd;
      color: #1565c0;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
    }

    .no-roles {
      color: #999;
      font-style: italic;
    }

    .quick-links h3 {
      margin: 0 0 20px;
      font-size: 18px;
      color: #1a1a2e;
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .module-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 16px;
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .module-card.accessible {
      border-color: #e8f5e9;
    }

    .module-card.accessible:hover {
      border-color: #4caf50;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    .module-icon {
      font-size: 40px;
    }

    .module-info h4 {
      margin: 0;
      font-size: 18px;
      color: #1a1a2e;
    }

    .module-info p {
      margin: 4px 0 8px;
      color: #666;
      font-size: 14px;
    }

    .required-role {
      font-size: 12px;
      color: #888;
    }

    .module-link {
      margin-top: auto;
      padding: 10px 16px;
      background: #4caf50;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
      transition: background 0.2s;
    }

    .module-link:hover {
      background: #43a047;
    }

    .no-modules {
      grid-column: 1 / -1;
      padding: 40px;
      text-align: center;
      color: #666;
      background: #fafafa;
      border-radius: 12px;
    }

    .no-modules p {
      margin: 0;
    }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
  dynamicRouteService = inject(DynamicRouteService);

  private moduleDescriptions: Record<string, string> = {
    'orders': 'Manage customer orders',
    'payments': 'Process and view payments'
  };

  getModuleDescription(path: string): string {
    return this.moduleDescriptions[path] || 'Access this module';
  }
}
