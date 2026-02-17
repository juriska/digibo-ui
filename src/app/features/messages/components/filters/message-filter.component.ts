import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonPartsModule } from '@citadele/common-parts';
import { MessageFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-message-filter',
  imports: [FormsModule, MatExpansionModule, CommonPartsModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Message</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="filter-grid">
        <div class="filter-field">
          <label class="filter-label">Message ID</label>
          <cit-input
            placeholder="Message ID"
            [ngModel]="filter().messageId"
            (ngModelChange)="updateField('messageId', $event)"
            name="messageId" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Message text</label>
          <cit-input
            placeholder="Message text"
            [ngModel]="filter().messageText"
            (ngModelChange)="updateField('messageText', $event)"
            name="messageText" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Message class</label>
          <cit-dropdown
            placeholder="Select class"
            [options]="classOptions"
            [ngModel]="filter().messageClass"
            (ngModelChange)="updateField('messageClass', $event)"
            name="messageClass" />
        </div>
        <div class="filter-field checkbox-row">
          <label class="checkbox-label">
            <input type="checkbox"
              [checked]="filter().isQuestion"
              (change)="updateBoolField('isQuestion', $any($event.target).checked)" />
            Question
          </label>
          <label class="checkbox-label">
            <input type="checkbox"
              [checked]="filter().isAnswer"
              (change)="updateBoolField('isAnswer', $any($event.target).checked)" />
            Answer
          </label>
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    .filter-grid {
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
    .checkbox-row {
      flex-direction: row;
      align-items: center;
      gap: 24px;
      padding-top: 20px;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .filter-grid { grid-template-columns: 1fr; }
    }
  `
})
export class MessageFilterComponent {
  filter = model.required<MessageFilter>();

  readonly classOptions = [
    { label: 'All', value: '' },
    { label: 'Class A', value: 'A' },
    { label: 'Class B', value: 'B' },
    { label: 'Class C', value: 'C' }
  ];

  updateField(field: keyof MessageFilter, value: string): void {
    this.filter.update(current => ({ ...current, [field]: value }));
  }

  updateBoolField(field: 'isQuestion' | 'isAnswer', value: boolean): void {
    this.filter.update(current => ({ ...current, [field]: value }));
  }
}
