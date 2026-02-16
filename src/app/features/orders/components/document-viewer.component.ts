import { Component, input, output, signal, computed } from '@angular/core';
import { CommonPartsModule } from '@citadele/common-parts';

@Component({
  selector: 'app-document-viewer',
  imports: [CommonPartsModule],
  template: `
    @if (isOpen()) {
      <div class="viewer-overlay" (click)="close.emit()">
        <div class="viewer-panel"
             [style.width]="width()"
             (click)="$event.stopPropagation()">

          <!-- Header -->
          <div class="panel-header">
            <div class="header-info">
              <h3 class="doc-title">{{ documentTitle() }}</h3>
              <span class="doc-id">ID: {{ documentId() }}</span>
            </div>
            <div class="header-actions">
              <cit-button appearance="tertiary" size="small" (click$)="onRefresh()">
                Refresh
              </cit-button>
              <cit-button appearance="tertiary" size="small" (click$)="close.emit()">
                Close
              </cit-button>
            </div>
          </div>

          <!-- Content -->
          <div class="panel-content">
            @if (isLoading()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading document...</p>
              </div>
            } @else if (hasError()) {
              <div class="error-state">
                <h4>Failed to load document</h4>
                <p>The document could not be loaded.</p>
                <div class="error-actions">
                  <cit-button appearance="secondary" size="small" (click$)="onRefresh()">
                    Try Again
                  </cit-button>
                  <cit-button appearance="tertiary" size="small" (click$)="close.emit()">
                    Close
                  </cit-button>
                </div>
              </div>
            } @else {
              <div class="document-details">
                <div class="detail-section">
                  <h4>Document Information</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <label>Document ID</label>
                      <span>{{ mockData().id }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Type</label>
                      <span>{{ mockData().type }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Status</label>
                      <span class="status-label">{{ mockData().status }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Created</label>
                      <span>{{ mockData().createdDate }}</span>
                    </div>
                    <div class="detail-item">
                      <label>Created By</label>
                      <span>{{ mockData().createdBy }}</span>
                    </div>
                  </div>
                </div>

                <div class="detail-section">
                  <h4>Description</h4>
                  <p class="description">{{ mockData().description }}</p>
                </div>

                <div class="mock-notice">
                  This is mock data. In production, this would load from the document management system.
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          @if (!isLoading() && !hasError()) {
            <div class="panel-footer">
              <cit-button appearance="secondary" size="small">
                Download
              </cit-button>
              <cit-button appearance="secondary" size="small">
                Print
              </cit-button>
              <cit-button appearance="primary" size="small">
                Edit
              </cit-button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .viewer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
    }

    .viewer-panel {
      height: 100%;
      background: white;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #eee;
      background: #fafafa;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .doc-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .doc-id {
      font-size: 12px;
      color: #888;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e0e0e0;
      border-top-color: #1976d2;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-state h4 {
      color: #dc3545;
      margin: 0 0 8px 0;
    }

    .error-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }

    .detail-section {
      margin-bottom: 24px;
    }

    .detail-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .detail-item label {
      font-size: 12px;
      color: #888;
      font-weight: 500;
    }

    .detail-item span {
      font-size: 14px;
      color: #333;
    }

    .status-label {
      font-weight: 600;
      color: #2e7d32;
    }

    .description {
      color: #555;
      line-height: 1.5;
    }

    .mock-notice {
      background: #e3f2fd;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 13px;
      color: #1565c0;
    }

    .panel-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px;
      border-top: 1px solid #eee;
      background: #fafafa;
    }
  `
})
export class DocumentViewerComponent {
  documentId = input('');
  documentTitle = input('Document Details');
  isOpen = input(false);
  width = input('600px');

  close = output<void>();
  documentLoaded = output<string>();

  isLoading = signal(false);
  hasError = signal(false);

  mockData = computed(() => ({
    id: this.documentId(),
    title: this.documentTitle(),
    type: 'Free Form Order',
    status: 'Approved',
    createdDate: new Date().toLocaleDateString(),
    description: 'This document contains the details of the free form order submitted through the backoffice system.',
    createdBy: 'System User',
  }));

  onRefresh(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    setTimeout(() => {
      this.isLoading.set(false);
      this.documentLoaded.emit(this.documentId());
    }, 500);
  }
}
