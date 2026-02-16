import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, delay, throwError, catchError, map } from 'rxjs';
import {
  FFODocument,
  FFOCategory,
  CategorizeDocumentRequest,
  CategorizeDocumentResponse,
  UpdateProcessingStatusRequest,
  UpdateProcessingStatusResponse,
} from '../models/ffo.types';

@Injectable({ providedIn: 'root' })
export class FreeFormOrdersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/ffo';
  private readonly mockEnabled = true;

  getFFODocuments(): Observable<FFODocument[]> {
    if (this.mockEnabled) {
      return this.getMockFFODocuments();
    }
    return this.http.get<FFODocument[]>(`${this.baseUrl}/documents`).pipe(
      catchError(this.handleError)
    );
  }

  getFFODocumentById(id: number): Observable<FFODocument> {
    if (this.mockEnabled) {
      return this.getMockFFODocumentById(id);
    }
    return this.http.get<FFODocument>(`${this.baseUrl}/documents/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getFFOCategories(): Observable<FFOCategory[]> {
    if (this.mockEnabled) {
      return this.getMockFFOCategories();
    }
    return this.http.get<FFOCategory[]>(`${this.baseUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  categorizeDocument(
    documentId: number,
    request: CategorizeDocumentRequest
  ): Observable<CategorizeDocumentResponse> {
    if (this.mockEnabled) {
      return this.getMockCategorizeResponse(documentId, request);
    }
    return this.http
      .post<CategorizeDocumentResponse>(`${this.baseUrl}/documents/${documentId}/categorize`, request)
      .pipe(catchError(this.handleError));
  }

  updateProcessingStatus(
    documentId: number,
    request: UpdateProcessingStatusRequest
  ): Observable<UpdateProcessingStatusResponse> {
    if (this.mockEnabled) {
      return this.getMockProcessingStatusResponse(documentId, request);
    }
    return this.http
      .post<UpdateProcessingStatusResponse>(`${this.baseUrl}/documents/${documentId}/processing`, request)
      .pipe(catchError(this.handleError));
  }

  private getMockFFODocuments(): Observable<FFODocument[]> {
    const mockData: FFODocument[] = [
      {
        ID: 1, CLASS_ID: 1001, STATUS_ID: 1,
        ORDER_DATE: '2024-01-15T08:00:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-001',
        CREATOR_CHANNEL_ID: 1, LOGIN: 'john.doe',
        FF_SUBJECT: 'Currency Exchange Request - EUR to USD',
        WOC_ID: 5001, GLB_CUST_ID: 1001, SECTOR: 100,
        SEGMENT: 'RETAIL', ISDOCUMENTATTACHED: 1,
        CATEGORY_ID: 201, SUBCATEGORY_ID: 301,
        CATEGORY_NAME: 'Currency Exchange', SUBCATEGORY_NAME: 'EUR to USD',
        ASSIGNEE: 7001, DOCUMENT_ATTACHED: 1
      },
      {
        ID: 2, CLASS_ID: 1001, STATUS_ID: 1,
        ORDER_DATE: '2024-01-16T09:15:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-002',
        CREATOR_CHANNEL_ID: 2, LOGIN: 'jane.smith',
        FF_SUBJECT: 'Currency Purchase - USD Request',
        WOC_ID: 5002, GLB_CUST_ID: 1002, SECTOR: 100,
        SEGMENT: 'RETAIL', ISDOCUMENTATTACHED: 1,
        CATEGORY_ID: 201, SUBCATEGORY_ID: 302,
        CATEGORY_NAME: 'Currency Exchange', SUBCATEGORY_NAME: 'EUR to GBP',
        ASSIGNEE: null, DOCUMENT_ATTACHED: 1
      },
      {
        ID: 3, CLASS_ID: 1001, STATUS_ID: 3,
        ORDER_DATE: '2024-01-17T11:00:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-003',
        CREATOR_CHANNEL_ID: 1, LOGIN: 'bob.wilson',
        FF_SUBJECT: 'International Payment Inquiry',
        WOC_ID: 5003, GLB_CUST_ID: 1003, SECTOR: 200,
        SEGMENT: 'CORPORATE', ISDOCUMENTATTACHED: 0,
        CATEGORY_ID: 202, SUBCATEGORY_ID: 303,
        CATEGORY_NAME: 'General Inquiry', SUBCATEGORY_NAME: 'Payment Information',
        ASSIGNEE: 7002, DOCUMENT_ATTACHED: 0
      },
      {
        ID: 4, CLASS_ID: 1002, STATUS_ID: 4,
        ORDER_DATE: '2024-01-18T14:30:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-004',
        CREATOR_CHANNEL_ID: 1, LOGIN: 'alice.brown',
        FF_SUBJECT: 'Account Statement Request',
        WOC_ID: 5004, GLB_CUST_ID: 1004, SECTOR: 100,
        SEGMENT: 'RETAIL', ISDOCUMENTATTACHED: 0,
        CATEGORY_ID: 202, SUBCATEGORY_ID: null,
        CATEGORY_NAME: 'General Inquiry', SUBCATEGORY_NAME: null,
        ASSIGNEE: 7001, DOCUMENT_ATTACHED: 0
      },
      {
        ID: 5, CLASS_ID: 1001, STATUS_ID: 5,
        ORDER_DATE: '2024-01-19T09:45:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-005',
        CREATOR_CHANNEL_ID: 2, LOGIN: 'charlie.davis',
        FF_SUBJECT: 'SEPA Transfer Correction',
        WOC_ID: 5005, GLB_CUST_ID: 1005, SECTOR: 200,
        SEGMENT: 'CORPORATE', ISDOCUMENTATTACHED: 1,
        CATEGORY_ID: null, SUBCATEGORY_ID: null,
        CATEGORY_NAME: null, SUBCATEGORY_NAME: null,
        ASSIGNEE: null, DOCUMENT_ATTACHED: 1
      },
      {
        ID: 6, CLASS_ID: 1001, STATUS_ID: 2,
        ORDER_DATE: '2024-01-20T10:00:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-006',
        CREATOR_CHANNEL_ID: 1, LOGIN: 'david.lee',
        FF_SUBJECT: 'Card Replacement Order',
        WOC_ID: 5006, GLB_CUST_ID: 1006, SECTOR: 100,
        SEGMENT: 'RETAIL', ISDOCUMENTATTACHED: 0,
        CATEGORY_ID: null, SUBCATEGORY_ID: null,
        CATEGORY_NAME: null, SUBCATEGORY_NAME: null,
        ASSIGNEE: 7003, DOCUMENT_ATTACHED: 0
      },
      {
        ID: 7, CLASS_ID: 1002, STATUS_ID: 1,
        ORDER_DATE: '2024-01-21T16:20:00Z',
        DOCUMENT_NUMBER: 'FFO-2024-007',
        CREATOR_CHANNEL_ID: 1, LOGIN: 'emma.wilson',
        FF_SUBJECT: 'Loan Application Review',
        WOC_ID: 5007, GLB_CUST_ID: 1007, SECTOR: 200,
        SEGMENT: 'CORPORATE', ISDOCUMENTATTACHED: 1,
        CATEGORY_ID: 201, SUBCATEGORY_ID: 301,
        CATEGORY_NAME: 'Currency Exchange', SUBCATEGORY_NAME: 'EUR to USD',
        ASSIGNEE: null, DOCUMENT_ATTACHED: 1
      }
    ];
    return of(mockData).pipe(delay(400));
  }

  private getMockFFODocumentById(id: number): Observable<FFODocument> {
    return this.getMockFFODocuments().pipe(
      map(docs => {
        const doc = docs.find(d => d.ID === id);
        if (!doc) throw new Error(`FFO Document with ID ${id} not found`);
        return doc;
      })
    );
  }

  private getMockFFOCategories(): Observable<FFOCategory[]> {
    return of([
      { ID: 201, NAME: 'Currency Exchange', PARENT_ID: null },
      { ID: 301, NAME: 'EUR to USD', PARENT_ID: 201 },
      { ID: 302, NAME: 'EUR to GBP', PARENT_ID: 201 },
      { ID: 202, NAME: 'General Inquiry', PARENT_ID: null },
      { ID: 303, NAME: 'Payment Information', PARENT_ID: 202 }
    ]).pipe(delay(200));
  }

  private getMockCategorizeResponse(
    documentId: number,
    request: CategorizeDocumentRequest
  ): Observable<CategorizeDocumentResponse> {
    return of({
      success: true, documentId,
      categoryId: request.categoryId,
      subCategoryId: request.subCategoryId,
      assignee: request.assignee,
      result: 0, message: 'Document categorized successfully'
    }).pipe(delay(200));
  }

  private getMockProcessingStatusResponse(
    documentId: number,
    request: UpdateProcessingStatusRequest
  ): Observable<UpdateProcessingStatusResponse> {
    return of({
      success: true, documentId: documentId.toString(),
      newStatus: request.newStatus,
      result: 0, message: 'Processing status updated successfully'
    }).pipe(delay(200));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Server returned code ${error.status}: ${error.message}`;
    console.error('FFO API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
