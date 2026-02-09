import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payments-page">
      <div class="page-header">
        <h1>Payments Management</h1>
        <p class="role-badge">
          Required Roles: <code>RBOPAYMENT</code> or <code>RBOPAYMENTVIEW</code>
        </p>
      </div>
    
      <div class="content-card">
        <h2>Payments Dashboard</h2>
        <p>This page is visible to users with <strong>RBOPAYMENT</strong> or <strong>RBOPAYMENTVIEW</strong> role.</p>
    
        <div class="user-permissions">
          <h4>Your Access Level:</h4>
          <ul>
            @if (canEdit) {
              <li>
                <span class="permission-granted">Full Access (RBOPAYMENT)</span> - Can view and edit payments
              </li>
            }
            @if (canViewOnly) {
              <li>
                <span class="permission-view">View Only (RBOPAYMENTVIEW)</span> - Can only view payments
              </li>
            }
          </ul>
        </div>
    
        <div class="demo-table">
          <h3>Recent Payments</h3>
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
                <th>Status</th>
                @if (canEdit) {
                  <th>Actions</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (payment of mockPayments; track payment) {
                <tr>
                  <td>{{ payment.id }}</td>
                  <td>{{ payment.fromAccount }}</td>
                  <td>{{ payment.toAccount }}</td>
                  <td>{{ payment.amount | currency:'EUR' }}</td>
                  <td>
                    <span class="status" [class]="payment.status.toLowerCase()">
                      {{ payment.status }}
                    </span>
                  </td>
                  @if (canEdit) {
                    <td>
                      <button class="btn-action" (click)="approvePayment(payment)">
                        Approve
                      </button>
                      <button class="btn-action btn-secondary" (click)="rejectPayment(payment)">
                        Reject
                      </button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
    
        @if (canEdit) {
          <div class="action-panel">
            <h3>Payment Actions</h3>
            <button class="btn-primary">Create New Payment</button>
            <button class="btn-secondary">Export Report</button>
          </div>
        }
    
        @if (canViewOnly && !canEdit) {
          <div class="view-only-notice">
            <p>You have view-only access. Contact administrator for edit permissions.</p>
          </div>
        }
      </div>
    </div>
    `,
  styles: [`
    .payments-page {
      padding: 20px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0 0 8px 0;
      color: #1a1a2e;
    }

    .role-badge {
      margin: 0;
      color: #666;
    }

    .role-badge code {
      background: #e3f2fd;
      color: #1565c0;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      margin-right: 4px;
    }

    .content-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .content-card h2 {
      margin: 0 0 16px 0;
      color: #1a1a2e;
    }

    .user-permissions {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 16px 0;
    }

    .user-permissions h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
    }

    .user-permissions ul {
      margin: 0;
      padding-left: 20px;
    }

    .permission-granted {
      color: #2e7d32;
      font-weight: 600;
    }

    .permission-view {
      color: #1565c0;
      font-weight: 600;
    }

    .demo-table {
      margin-top: 24px;
    }

    .demo-table h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #444;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f5f5f5;
      font-weight: 600;
      color: #333;
    }

    tr:hover {
      background: #fafafa;
    }

    .status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status.pending {
      background: #fff3e0;
      color: #e65100;
    }

    .status.approved {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status.rejected {
      background: #ffebee;
      color: #c62828;
    }

    .btn-action {
      padding: 4px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      margin-right: 4px;
      background: #4caf50;
      color: white;
    }

    .btn-action.btn-secondary {
      background: #f44336;
    }

    .btn-action:hover {
      opacity: 0.9;
    }

    .action-panel {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .action-panel h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #444;
    }

    .btn-primary {
      padding: 10px 20px;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    }

    .btn-secondary {
      padding: 10px 20px;
      background: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
    }

    .view-only-notice {
      margin-top: 24px;
      padding: 16px;
      background: #fff3e0;
      border-radius: 8px;
      color: #e65100;
    }

    .view-only-notice p {
      margin: 0;
    }
  `]
})
export class PaymentsComponent {
  private authService = inject(AuthService);

  // Check user's access level
  get canEdit(): boolean {
    return this.authService.hasRole('RBOPAYMENT');
  }

  get canViewOnly(): boolean {
    return this.authService.hasRole('RBOPAYMENTVIEW');
  }

  mockPayments = [
    { id: 'PAY-001', fromAccount: 'LV12HABA0012345678', toAccount: 'LV98UNLA0055667788', amount: 500.00, status: 'Pending' },
    { id: 'PAY-002', fromAccount: 'LV34PARX9876543210', toAccount: 'LV56RIKO1122334455', amount: 1200.50, status: 'Approved' },
    { id: 'PAY-003', fromAccount: 'LV78HABA5544332211', toAccount: 'LV90UNLA6677889900', amount: 75.00, status: 'Rejected' },
    { id: 'PAY-004', fromAccount: 'LV11PARX1234567890', toAccount: 'LV22RIKO0987654321', amount: 3500.00, status: 'Pending' },
    { id: 'PAY-005', fromAccount: 'LV55HABA1111222233', toAccount: 'LV66UNLA4444555566', amount: 890.25, status: 'Approved' },
  ];

  approvePayment(payment: any): void {
    alert(`Approving payment ${payment.id}`);
  }

  rejectPayment(payment: any): void {
    alert(`Rejecting payment ${payment.id}`);
  }
}
