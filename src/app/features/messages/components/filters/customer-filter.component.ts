import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonPartsModule } from '@citadele/common-parts';
import { MessageCustomerFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-customer-filter',
  imports: [FormsModule, MatExpansionModule, CommonPartsModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Customer</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="filter-row">
        <div class="filter-field">
          <label class="filter-label">Customer ID</label>
          <cit-input
            placeholder="Customer ID"
            [ngModel]="filter().customerId"
            (ngModelChange)="updateField('customerId', $event)"
            name="customerId" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Customer name</label>
          <cit-input
            placeholder="Customer name"
            [ngModel]="filter().customerName"
            (ngModelChange)="updateField('customerName', $event)"
            name="customerName" />
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    .filter-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .filter-field {
      display: flex;
      flex-direction: column;
    }
    .filter-label {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-bottom: 4px;
    }
    @media (max-width: 768px) {
      .filter-row { grid-template-columns: 1fr; }
    }
  `
})
export class CustomerFilterComponent {
  filter = model.required<MessageCustomerFilter>();

  updateField(field: keyof MessageCustomerFilter, value: string): void {
    this.filter.update(current => ({ ...current, [field]: value }));
  }
}
