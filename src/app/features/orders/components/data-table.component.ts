import { Component, input, output, signal, computed } from '@angular/core';
import { CommonPartsModule, BadgeType } from '@citadele/common-parts';

export interface TableColumn {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'badge';
  badgeType?: (value: any) => BadgeType;
  formatter?: (value: any) => string;
}

@Component({
  selector: 'app-data-table',
  imports: [CommonPartsModule],
  template: `
    <div class="table-container">
      @if (loading()) {
        <div class="table-loading">
          <div class="spinner"></div>
          <span>Loading data...</span>
        </div>
      }

      <div class="table-responsive">
        <table class="data-table"
               [class.striped]="striped()"
               [class.hover-rows]="hover()">
          <thead>
            <tr>
              @for (col of columns(); track col.key) {
                <th [style.width]="col.width"
                    [class.sortable]="col.sortable"
                    (click)="col.sortable && onSort(col)">
                  <div class="th-content">
                    <span>{{ col.title }}</span>
                    @if (col.sortable) {
                      <span class="sort-icon">
                        @if (sortedColumn() === col.key) {
                          {{ sortDirection() === 'asc' ? '\u25B2' : '\u25BC' }}
                        } @else {
                          \u25BD
                        }
                      </span>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (sortedData().length > 0) {
              @for (row of sortedData(); track $index) {
                <tr (click)="rowClick.emit(row)" class="clickable-row">
                  @for (col of columns(); track col.key) {
                    <td>
                      @if (col.type === 'badge' && col.badgeType) {
                        <cit-badge [badgeType]="col.badgeType(row[col.key])">
                          {{ col.formatter ? col.formatter(row[col.key]) : row[col.key] }}
                        </cit-badge>
                      } @else {
                        {{ col.formatter ? col.formatter(row[col.key]) : row[col.key] }}
                      }
                    </td>
                  }
                </tr>
              }
            } @else if (!loading()) {
              <tr>
                <td [attr.colspan]="columns().length" class="no-data-cell">
                  <cit-no-data [mainText]="noDataMessage()" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (sortedData().length > 0) {
        <div class="table-footer">
          <span class="record-count">
            Showing {{ sortedData().length }} of {{ totalCount() }} record(s)
          </span>
        </div>
      }
    </div>
  `,
  styles: `
    .table-container {
      position: relative;
    }

    .table-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      color: #666;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .data-table th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #333;
      background: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
      white-space: nowrap;
    }

    .data-table td {
      padding: 10px 16px;
      border-bottom: 1px solid #eee;
      color: #444;
    }

    .data-table.striped tbody tr:nth-child(even) {
      background: #fafafa;
    }

    .data-table.hover-rows tbody tr:hover {
      background: #f0f4ff;
    }

    .sortable {
      cursor: pointer;
      user-select: none;
    }

    .sortable:hover {
      background: #eef1f5;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sort-icon {
      font-size: 10px;
      color: #999;
    }

    .clickable-row {
      cursor: pointer;
    }

    .no-data-cell {
      text-align: center;
      padding: 32px 16px;
    }

    .table-footer {
      display: flex;
      justify-content: flex-end;
      padding: 12px 16px;
      border-top: 1px solid #eee;
    }

    .record-count {
      font-size: 13px;
      color: #666;
    }
  `
})
export class DataTableComponent {
  columns = input<TableColumn[]>([]);
  data = input<any[]>([]);
  noDataMessage = input('No data available');
  striped = input(true);
  hover = input(true);
  totalCount = input(0);
  loading = input(false);

  rowClick = output<any>();
  sortChange = output<{ active: string; direction: 'asc' | 'desc' }>();

  sortedColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  sortedData = computed(() => {
    const items = [...this.data()];
    const col = this.sortedColumn();
    const dir = this.sortDirection();

    if (!col) return items;

    return items.sort((a, b) => {
      const aVal = a[col];
      const bVal = b[col];
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return dir === 'asc' ? cmp : -cmp;
    });
  });

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortedColumn() === column.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortedColumn.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sortChange.emit({
      active: column.key,
      direction: this.sortDirection()
    });
  }
}
