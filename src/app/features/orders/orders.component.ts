import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <h1>Orders Management</h1>
        <p class="role-badge">Required Role: <code>RBOFFORDERS</code></p>
      </div>
    
      <div class="content-card">
        <h2>Orders Dashboard</h2>
        <p>This page is only visible to users with the <strong>RBOFFORDERS</strong> role.</p>
    
        <div class="demo-table">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (order of mockOrders; track order) {
                <tr>
                  <td>{{ order.id }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ order.amount | currency:'EUR' }}</td>
                  <td>
                    <span class="status" [class]="order.status.toLowerCase()">
                      {{ order.status }}
                    </span>
                  </td>
                  <td>{{ order.date }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `,
  styles: [`
    .orders-page {
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
      background: #e8f5e9;
      color: #2e7d32;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
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

    .status.completed {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status.processing {
      background: #e3f2fd;
      color: #1565c0;
    }
  `]
})
export class OrdersComponent {
  mockOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 1250.00, status: 'Completed', date: '2024-01-20' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 890.50, status: 'Processing', date: '2024-01-21' },
    { id: 'ORD-003', customer: 'Bob Wilson', amount: 2100.00, status: 'Pending', date: '2024-01-22' },
    { id: 'ORD-004', customer: 'Alice Brown', amount: 450.75, status: 'Completed', date: '2024-01-22' },
    { id: 'ORD-005', customer: 'Charlie Davis', amount: 3200.00, status: 'Processing', date: '2024-01-23' },
  ];
}
