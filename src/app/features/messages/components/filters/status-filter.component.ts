import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MessageStatus, MessageStatusFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-status-filter',
  imports: [FormsModule, MatExpansionModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Status</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="status-checkboxes">
        @for (option of statusOptions; track option.value) {
          <label class="checkbox-label">
            <input type="checkbox"
              [checked]="isChecked(option.value)"
              (change)="toggleStatus(option.value, $any($event.target).checked)" />
            {{ option.label }}
          </label>
        }
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    .status-checkboxes {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
  `
})
export class StatusFilterComponent {
  filter = model.required<MessageStatusFilter>();

  readonly statusOptions: { label: string; value: MessageStatus }[] = [
    { label: 'New', value: 'NEW' },
    { label: 'Seen', value: 'SEEN' },
    { label: 'Answered partly', value: 'ANSWERED_PARTLY' },
    { label: 'Answered and closed', value: 'ANSWERED_AND_CLOSED' },
    { label: 'Not answered and closed', value: 'NOT_ANSWERED_AND_CLOSED' }
  ];

  isChecked(status: MessageStatus): boolean {
    return this.filter().statuses.includes(status);
  }

  toggleStatus(status: MessageStatus, checked: boolean): void {
    this.filter.update(current => {
      const statuses = checked
        ? [...current.statuses, status]
        : current.statuses.filter(s => s !== status);
      return { statuses };
    });
  }
}
