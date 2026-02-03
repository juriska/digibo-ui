import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Add withCredentials to all requests so httpOnly cookies are sent
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        // Don't redirect if already on login page or auth endpoints
        if (!req.url.includes('/api/auth/')) {
          router.navigate(['/login']);
        }
      }

      // Handle 403 Forbidden - redirect to unauthorized page
      if (error.status === 403) {
        router.navigate(['/unauthorized']);
      }

      return throwError(() => error);
    })
  );
};
