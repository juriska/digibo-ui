import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonPartsModule, BadgeType } from '@citadele/common-parts';
import { FreeFormOrdersApiService } from '../../core/services/free-form-orders-api.service';
import { FilterManagerService } from '../../core/services/filter-manager.service';
import { FFODocument, getFFOStatusText } from '../../core/models/ffo.types';
import { LoadingState, initialLoadingState } from '../../core/models/loading-state';
import { DataTableComponent, TableColumn } from './components/data-table.component';
import { DocumentViewerComponent } from './components/document-viewer.component';

@Component({
  selector: 'app-orders',
  imports: [
    FormsModule,
    CommonPartsModule,
    DataTableComponent,
    DocumentViewerComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly ordersApi = inject(FreeFormOrdersApiService);
  private readonly filterManager = inject(FilterManagerService);

  // Loading state
  private readonly _loadingState = signal<LoadingState>(initialLoadingState);
  private readonly _documents = signal<FFODocument[]>([]);
  private readonly _allDocuments = signal<FFODocument[]>([]);
  private readonly _totalCount = signal<number>(0);

  // Public computed signals
  readonly documents = computed(() => this._documents());
  readonly totalCount = computed(() => this._totalCount());
  readonly isLoading = computed(() => this._loadingState().loading);
  readonly hasError = computed(() => !!this._loadingState().error);
  readonly errorMessage = computed(() => this._loadingState().error);

  // Filter state
  dateFrom: Date | null = null;
  dateTill: Date | null = null;
  documentNumber = '';
  documentType = '';

  // Document type options for dropdown
  readonly documentTypeOptions = [
    { label: 'All Categories', value: '' },
    { label: 'Currency Exchange', value: 'Currency Exchange' },
    { label: 'General Inquiry', value: 'General Inquiry' },
  ];

  // Delivery address form fields (demo)
  fullName = '';
  address = '';
  city = '';
  phone = '';
  pincode = '';
  landmark = '';
  addressType = '';
  deliveryOption = '';
  paymentMethod = '';
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCcv = '';

  // Address type options for radio
  readonly addressTypeOptions = [
    { label: 'Home (All day delivery)', value: '1' },
    { label: 'Office (Delivery between 10 AM - 5 PM)', value: '2' },
  ];

  // Delivery options for radio
  readonly deliveryOptions = [
    { label: 'Standard 3-5 Days', value: '1' },
    { label: 'Express', value: '2' },
    { label: 'Overnight', value: '3' },
  ];

  // Payment method options for radio
  readonly paymentMethodOptions = [
    { label: 'Credit/Debit/ATM Card', value: '1' },
    { label: 'Cash on Delivery', value: '2' },
  ];

  // Expansion panel content configs
  readonly deliveryAddressPanel = { label: 'Delivery Address', iconSource: '', description: '' };
  readonly deliveryOptionsPanel = { label: 'Delivery Options', iconSource: '', description: '' };
  readonly paymentMethodPanel = { label: 'Payment Method', iconSource: '', description: 'test' };
  readonly dateFiltersPanel = { label: 'Date Filters', iconSource: '', description: '' };
  readonly documentFiltersPanel = { label: 'Document Filters', iconSource: '', description: '' };

  // Document viewer state
  isDocumentViewerOpen = false;
  selectedDocumentId = '';
  selectedDocumentTitle = '';

  // Table columns configuration
  readonly tableColumns: TableColumn[] = [
    { key: 'DOCUMENT_NUMBER', title: 'Document Number', width: '150px', sortable: true, type: 'text' },
    {
      key: 'ORDER_DATE', title: 'Order Date', width: '130px', sortable: true, type: 'date',
      formatter: (value: string) => this.formatDate(value)
    },
    {
      key: 'STATUS_ID', title: 'Status', width: '110px', sortable: true, type: 'badge',
      badgeType: (value: number) => this.getStatusBadgeType(value),
      formatter: (value: number) => getFFOStatusText(value)
    },
    { key: 'FF_SUBJECT', title: 'Subject', sortable: true, type: 'text' },
    { key: 'CATEGORY_NAME', title: 'Category', width: '150px', sortable: true, type: 'text',
      formatter: (v: string | null) => v ?? '-' },
    { key: 'SEGMENT', title: 'Segment', width: '120px', sortable: true, type: 'text' },
    { key: 'LOGIN', title: 'Created By', width: '140px', sortable: true, type: 'text' },
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    this._loadingState.set({ loading: true, error: null });
    this.ordersApi.getFFODocuments().subscribe({
      next: (documents) => {
        this._allDocuments.set(documents);
        this.applyFilters();
        this._loadingState.set({ loading: false, error: null });
      },
      error: (error) => {
        console.error('Error loading FFO documents:', error);
        this._loadingState.set({ loading: false, error: 'Failed to load documents. Please try again.' });
        this._documents.set([]);
        this._totalCount.set(0);
      }
    });
  }

  private applyFilters(): void {
    let filtered = [...this._allDocuments()];

    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filtered = filtered.filter(doc => new Date(doc.ORDER_DATE) >= fromDate);
    }
    if (this.dateTill) {
      const tillDate = new Date(this.dateTill);
      filtered = filtered.filter(doc => new Date(doc.ORDER_DATE) <= tillDate);
    }
    if (this.documentNumber) {
      filtered = filtered.filter(doc =>
        doc.DOCUMENT_NUMBER.toLowerCase().includes(this.documentNumber.toLowerCase())
      );
    }
    if (this.documentType) {
      filtered = filtered.filter(doc => doc.CATEGORY_NAME === this.documentType);
    }

    this._documents.set(filtered);
    this._totalCount.set(filtered.length);
  }

  retryLoading(): void {
    this.loadDocuments();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onClearAllFilters(): void {
    this.dateFrom = null;
    this.dateTill = null;
    this.documentNumber = '';
    this.documentType = '';
    this.filterManager.clearAllFilters();
    this.applyFilters();
  }

  onDateFromChange(value: Date): void {
    this.dateFrom = value ?? null;
    this.filterManager.updateFilter('dateFilter', {
      dateFrom: this.dateFrom?.toISOString() ?? null,
      dateTill: this.dateTill?.toISOString() ?? null
    });
  }

  onDateTillChange(value: Date): void {
    this.dateTill = value ?? null;
    this.filterManager.updateFilter('dateFilter', {
      dateFrom: this.dateFrom?.toISOString() ?? null,
      dateTill: this.dateTill?.toISOString() ?? null
    });
  }

  onDocumentNumberChange(): void {
    this.filterManager.updateFilter('documentFilter', {
      documentNumber: this.documentNumber,
      documentType: this.documentType
    });
  }

  onDocumentTypeChange(value: any): void {
    this.documentType = value?.toString() ?? '';
    this.filterManager.updateFilter('documentFilter', {
      documentNumber: this.documentNumber,
      documentType: this.documentType
    });
    this.applyFilters();
  }

  onRowClick(document: FFODocument): void {
    this.selectedDocumentId = document.ID.toString();
    this.selectedDocumentTitle = `${document.DOCUMENT_NUMBER} - ${document.FF_SUBJECT}`;
    this.isDocumentViewerOpen = true;
  }

  closeDocumentViewer(): void {
    this.isDocumentViewerOpen = false;
    this.selectedDocumentId = '';
    this.selectedDocumentTitle = '';
  }

  onDocumentLoaded(documentId: string): void {
    console.log(`Document ${documentId} loaded`);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: '2-digit'
    }).format(date);
  }

  getStatusBadgeType(statusId: number): BadgeType {
    switch (statusId) {
      case 4: return BadgeType.success;
      case 1: return BadgeType.warning;
      case 2: return BadgeType.info;
      case 3: return BadgeType.info;
      case 5: return BadgeType.error;
      default: return BadgeType.neutral;
    }
  }
}
