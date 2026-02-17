import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1>DigiBo</h1>
          <p>Backoffice Login</p>
        </div>
    
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              name="username"
              placeholder="Enter username"
              required
              />
          </div>
    
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter password"
              required
              />
          </div>
    
          <button type="submit" class="login-btn" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
    
          @if (error) {
            <div class="error-message">
              {{ error }}
            </div>
          }
        </form>
    
        <!-- Test Users for Development -->
        <div class="mock-users">
          <div class="mock-users-header">
            <span class="dev-badge">DEV</span>
            <span>Quick Login (Test Users)</span>
          </div>
          <div class="mock-user-grid">
            <button class="mock-user-btn" (click)="quickLogin('user1', 'password1')" [disabled]="loading">
              <strong>user1</strong>
              <span class="roles">Admin - All Access</span>
              <span class="role-tags">
                <span class="tag orders">ORDERS</span>
                <span class="tag payments">PAYMENTS</span>
                <span class="tag messages">MESSAGES</span>
              </span>
            </button>
            <button class="mock-user-btn" (click)="quickLogin('user2', 'password2')" [disabled]="loading">
              <strong>user2</strong>
              <span class="roles">Orders Only</span>
              <span class="role-tags">
                <span class="tag orders">ORDERS</span>
              </span>
            </button>
            <button class="mock-user-btn" (click)="quickLogin('user3', 'password3')" [disabled]="loading">
              <strong>user3</strong>
              <span class="roles">Payments Only</span>
              <span class="role-tags">
                <span class="tag payments">PAYMENTS</span>
              </span>
            </button>
          </div>
        </div>
    
      </div>
    </div>
    `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      margin: 0;
      font-size: 32px;
      color: #1a1a2e;
      font-weight: 700;
    }

    .login-header p {
      margin: 8px 0 0;
      color: #666;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .form-group input {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #4fc3f7;
    }

    .login-btn {
      padding: 14px;
      background: #1a1a2e;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .login-btn:hover:not(:disabled) {
      background: #16213e;
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      padding: 12px;
      background: #ffebee;
      color: #c62828;
      border-radius: 8px;
      text-align: center;
    }

    /* Mock Users Section */
    .mock-users {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 2px dashed #e0e0e0;
    }

    .mock-users-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 13px;
      color: #666;
    }

    .dev-badge {
      background: #ff9800;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }

    .mock-user-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mock-user-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 12px 16px;
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
    }

    .mock-user-btn:hover {
      background: #f0f7ff;
      border-color: #4fc3f7;
    }

    .mock-user-btn strong {
      color: #1a1a2e;
      font-size: 14px;
    }

    .mock-user-btn .roles {
      color: #666;
      font-size: 12px;
      margin-top: 2px;
    }

    .mock-user-btn .role-tags {
      display: flex;
      gap: 4px;
      margin-top: 8px;
    }

    .mock-user-btn .tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }

    .mock-user-btn .tag.orders {
      background: #e3f2fd;
      color: #1565c0;
    }

    .mock-user-btn .tag.payments {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .mock-user-btn .tag.messages {
      background: #fff3e0;
      color: #e65100;
    }

  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = false;
  error = '';

  onLogin(): void {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Quick login using test credentials (calls real backend API)
   */
  quickLogin(username: string, password: string): void {
    this.loading = true;
    this.error = '';

    this.authService.login(username, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Is the backend running?';
        this.loading = false;
      }
    });
  }
}
