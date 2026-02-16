import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add withCredentials to requests', () => {
    http.get('/api/data').subscribe();

    const req = httpMock.expectOne('/api/data');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should redirect to /login on 401 for non-auth endpoints', () => {
    http.get('/api/orders').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/orders');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should NOT redirect to /login on 401 for auth endpoints', () => {
    http.get('/api/auth/me').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/auth/me');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /unauthorized on 403 for non-auth endpoints', () => {
    http.get('/api/admin/settings').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/admin/settings');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should NOT redirect on 403 for auth endpoints', () => {
    http.get('/api/auth/me').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/auth/me');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should propagate other errors without redirecting', () => {
    let errorReceived: any;
    http.get('/api/data').subscribe({ error: (err) => { errorReceived = err; } });

    const req = httpMock.expectOne('/api/data');
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorReceived.status).toBe(500);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
