import { Injectable, signal, computed } from '@angular/core';

export interface DateFilterData {
  dateFrom: string | null;
  dateTill: string | null;
}

export interface DocumentFilterData {
  documentNumber: string;
  documentType: string;
}

export interface FilterState {
  dateFilter?: DateFilterData;
  documentFilter?: DocumentFilterData;
}

@Injectable({ providedIn: 'root' })
export class FilterManagerService {
  private readonly filterState = signal<FilterState>({});

  readonly currentFilters = computed(() => this.filterState());

  readonly hasActiveFilters = computed(() => {
    const state = this.filterState();
    return !!(state.dateFilter || state.documentFilter);
  });

  updateFilter<T extends keyof FilterState>(
    filterType: T,
    filterData: FilterState[T]
  ): void {
    this.filterState.update(current => ({
      ...current,
      [filterType]: filterData
    }));
  }

  clearAllFilters(): void {
    this.filterState.set({});
  }

  clearFilter(filterType: keyof FilterState): void {
    this.filterState.update(current => {
      const next = { ...current };
      delete next[filterType];
      return next;
    });
  }

  getActiveFiltersCount(): number {
    const state = this.filterState();
    let count = 0;
    if (state.dateFilter && (state.dateFilter.dateFrom || state.dateFilter.dateTill)) count++;
    if (state.documentFilter && (state.documentFilter.documentNumber || state.documentFilter.documentType)) count++;
    return count;
  }
}
