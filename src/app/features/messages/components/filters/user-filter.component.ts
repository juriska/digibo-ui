import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonPartsModule } from '@citadele/common-parts';
import { MessageUserFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-user-filter',
  imports: [FormsModule, MatExpansionModule, CommonPartsModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>User</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="filter-row">
        <div class="filter-field">
          <label class="filter-label">Name, Surname</label>
          <cit-input
            placeholder="Name, Surname"
            [ngModel]="filter().nameSurname"
            (ngModelChange)="updateField('nameSurname', $event)"
            name="nameSurname" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Login name</label>
          <cit-input
            placeholder="Login name"
            [ngModel]="filter().loginName"
            (ngModelChange)="updateField('loginName', $event)"
            name="loginName" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Officer</label>
          <cit-dropdown
            placeholder="Select officer"
            [options]="officerOptions"
            [ngModel]="filter().officer"
            (ngModelChange)="updateField('officer', $event)"
            name="officer" />
        </div>
      </div>
    </mat-expansion-panel>
  `,
  styles: `
    .filter-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
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
export class UserFilterComponent {
  filter = model.required<MessageUserFilter>();

  readonly officerOptions = [
    { label: 'All', value: '' },
    { label: 'Officer 1', value: 'officer1' },
    { label: 'Officer 2', value: 'officer2' }
  ];

  updateField(field: keyof MessageUserFilter, value: string): void {
    this.filter.update(current => ({ ...current, [field]: value }));
  }
}
