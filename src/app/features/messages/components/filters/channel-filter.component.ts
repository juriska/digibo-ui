import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonPartsModule } from '@citadele/common-parts';
import { MessageChannelFilter } from '../../../../core/models/message.types';

@Component({
  selector: 'app-channel-filter',
  imports: [FormsModule, MatExpansionModule, CommonPartsModule],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Channel</mat-panel-title>
      </mat-expansion-panel-header>
      <div class="filter-row">
        <div class="filter-field">
          <label class="filter-label">Channel</label>
          <cit-dropdown
            placeholder="Select channel"
            [options]="channelOptions"
            [ngModel]="filter().channel"
            (ngModelChange)="updateChannel($event)"
            name="channel" />
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
  `
})
export class ChannelFilterComponent {
  filter = model.required<MessageChannelFilter>();

  readonly channelOptions = [
    { label: 'All', value: '' },
    { label: 'Web', value: 'WEB' },
    { label: 'Mobile', value: 'MOBILE' },
    { label: 'Branch', value: 'BRANCH' }
  ];

  updateChannel(value: string): void {
    this.filter.set({ channel: value });
  }
}
