import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonPartsModule } from '@citadele/common-parts';
import { MessageDateFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-date-filter',
  imports: [FormsModule, MatExpansionModule, CommonPartsModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Date Range</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="filter-row">
        <div class="filter-field">
          <label class="filter-label">Date from</label>
          <cit-date-input
            placeholder="Start date"
            [value]="filter().dateFrom!"
            (valueChange)="updateDate('dateFrom', $any($event))"
            [yearsLimit]="10" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Date to</label>
          <cit-date-input
            placeholder="End date"
            [value]="filter().dateTo!"
            (valueChange)="updateDate('dateTo', $any($event))"
            [yearsLimit]="10" />
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
export class DateFilterComponent {
  filter = model.required<MessageDateFilter>();

  updateDate(field: 'dateFrom' | 'dateTo', value: Date): void {
    this.filter.update(current => ({ ...current, [field]: value ?? null }));
  }
}
