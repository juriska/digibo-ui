import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-page">
      <div class="unauthorized-card">
        <div class="icon">🔒</div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="hint">Please contact your administrator if you believe this is an error.</p>
        <a routerLink="/" class="back-link">← Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .unauthorized-card {
      text-align: center;
      max-width: 400px;
    }

    .icon {
      font-size: 64px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: 28px;
      color: #c62828;
    }

    p {
      margin: 16px 0 0;
      color: #666;
    }

    .hint {
      font-size: 14px;
      color: #999;
    }

    .back-link {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 24px;
      background: #1a1a2e;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.2s;
    }

    .back-link:hover {
      background: #16213e;
    }
  `]
})
export class UnauthorizedComponent {}
