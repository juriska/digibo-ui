# DigiBo UI - Angular Frontend

Angular 19 frontend application for the DigiBo Backoffice system.

## Requirements

- Node.js 18+
- Angular CLI 19.2+

## Quick Start

### Development Server

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The application reloads automatically on file changes.

### Build for Production

```bash
ng build --configuration production
```

Build artifacts are stored in the `dist/` directory.

### Run Tests

```bash
ng test        # Unit tests
ng e2e         # End-to-end tests
```

---

## Authentication & Security

### Overview

The application uses **httpOnly cookie-based authentication** for enhanced security. Tokens are stored in secure cookies managed by the backend, not in localStorage (which is vulnerable to XSS attacks).

### Authentication Flow

```
1. User enters credentials on login page
2. POST /api/auth/login sends credentials to backend
3. Backend validates and sets httpOnly cookies
4. Response contains user info (roles, permissions)
5. AuthService stores user state in Angular signals
6. All subsequent HTTP requests include cookies automatically
7. DynamicRouteService registers routes based on user roles
```

### Key Security Features

| Feature | Description |
|---------|-------------|
| httpOnly Cookies | Tokens not accessible via JavaScript |
| withCredentials | All HTTP requests include cookies |
| Dynamic Routes | Unauthorized routes don't exist in router |
| Route Guards | Authentication and role-based guards |
| Server-side Validation | Backend validates permissions on each request |

---

## Authorization Architecture

### Dynamic Route Registration

Routes are **dynamically registered** based on user permissions. If a user doesn't have access to a module, the route doesn't exist in the Angular router - it's not just hidden, it's completely unavailable.

#### How It Works

1. **Route Configuration** (`core/config/route-config.ts`):
```typescript
export const FEATURE_ROUTES: FeatureRouteConfig[] = [
  {
    path: 'orders',
    label: 'Orders',
    icon: '📦',
    roles: ['RBOFFORDERS'],
    loadChildren: () => import('../../features/orders/orders.routes')
  },
  {
    path: 'payments',
    label: 'Payments',
    icon: '💳',
    roles: ['RBOPAYMENT', 'RBOPAYMENTVIEW'],
    loadChildren: () => import('../../features/payments/payments.routes')
  }
];
```

2. **On Login** - `DynamicRouteService.registerRoutesForRoles(roles)`:
   - Filters routes based on user's roles
   - Calls `Router.resetConfig()` to update router
   - Updates navigation items signal

3. **On Logout** - `DynamicRouteService.clearRoutes()`:
   - Removes all feature routes
   - Only login/unauthorized routes remain

### Adding New Feature Modules

1. Create the feature module and routes
2. Add configuration to `route-config.ts`:

```typescript
{
  path: 'customers',
  label: 'Customers',
  icon: '👥',
  roles: ['RBOCUSTOMER'],
  loadChildren: () => import('../../features/customers/customers.routes')
    .then(m => m.CUSTOMERS_ROUTES)
}
```

3. The module will automatically appear for users with the required role

---

## Project Structure

```
src/app/
├── core/                           # Shared services, guards, models
│   ├── config/
│   │   └── route-config.ts         # Feature route definitions with roles
│   ├── guards/
│   │   └── auth.guard.ts           # Authentication & role guards
│   ├── interceptors/
│   │   └── auth.interceptor.ts     # Adds withCredentials to requests
│   ├── models/
│   │   └── user.model.ts           # User, AuthResponse interfaces
│   └── services/
│       ├── auth.service.ts         # Authentication state management
│       └── dynamic-route.service.ts # Dynamic route registration
├── features/                       # Feature modules (lazy-loaded)
│   ├── dashboard/
│   ├── login/
│   ├── orders/
│   ├── payments/
│   └── unauthorized/
├── layout/
│   └── main-layout/                # Main app layout with dynamic nav
├── app.routes.ts                   # Base route configuration
├── app.config.ts                   # Application providers
└── app.component.ts
```

---

## Core Services

### AuthService (`core/services/auth.service.ts`)

Manages authentication state using Angular signals:

```typescript
// Signals
isAuthenticated: Signal<boolean>
user: Signal<User | null>
userRoles: Signal<string[]>
userPermissions: Signal<string[]>

// Methods
login(username, password): Observable<AuthResponse>
logout(): void
refreshToken(): Observable<AuthResponse>
hasRole(role): boolean
hasAnyRole(roles): boolean
hasPermission(permission): boolean
```

**Key Features:**
- Uses `withCredentials: true` for cookie-based auth
- Calls `/api/auth/me` on init to restore session
- Calls `/api/auth/logout` to clear server-side cookies
- Triggers `DynamicRouteService` on login/logout

### DynamicRouteService (`core/services/dynamic-route.service.ts`)

Manages dynamic route registration:

```typescript
// Signals
activeNavItems: Signal<NavItem[]>

// Methods
registerRoutesForRoles(roles: string[]): void
clearRoutes(): void
isRouteRegistered(path: string): boolean
```

### AuthInterceptor (`core/interceptors/auth.interceptor.ts`)

Automatically adds `withCredentials: true` to all HTTP requests:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true  // Cookies sent with every request
  });
  return next(authReq);
};
```

---

## Route Guards

### authGuard

Checks if user is authenticated:

```typescript
{
  path: '',
  loadComponent: () => import('./layout/main-layout/main-layout.component'),
  canActivate: [authGuard],  // Redirects to /login if not authenticated
  children: [...]
}
```

### roleGuard

Checks if user has required roles (OR logic):

```typescript
{
  path: 'orders',
  loadChildren: () => import('./features/orders/orders.routes'),
  canActivate: [roleGuard],
  data: { roles: ['RBOFFORDERS'] }  // Requires RBOFFORDERS role
}
```

### allRolesGuard

Checks if user has ALL required roles (AND logic):

```typescript
{
  path: 'admin',
  loadChildren: () => import('./features/admin/admin.routes'),
  canActivate: [allRolesGuard],
  data: { roles: ['ADMIN', 'SUPERUSER'] }  // Requires BOTH roles
}
```

---

## Mock Login (Development)

For development without backend, use mock login:

```typescript
// In browser console or component
authService.mockLogin('user1');  // Admin - all access
authService.mockLogin('user2');  // Orders only
authService.mockLogin('user3');  // Payments only
```

Available mock users:

| Username | Roles | Description |
|----------|-------|-------------|
| user1 | RBOFFORDERS, RBOPAYMENT, RBOPAYMENTVIEW, ADMIN | Full access |
| user2 | RBOFFORDERS | Orders module only |
| user3 | RBOPAYMENT, RBOPAYMENTVIEW | Payments module only |

---

## Security Best Practices Implemented

| Practice | Implementation |
|----------|----------------|
| No localStorage Tokens | Tokens in httpOnly cookies only |
| withCredentials | All requests include cookies |
| Dynamic Routes | Unauthorized routes don't exist |
| Lazy Loading | Modules loaded only when accessed |
| Route Guards | Multiple guard types for different scenarios |
| Permission Checks | Both client-side (UX) and server-side (security) |
| XSS Protection | No token exposure to JavaScript |

---

## Backend Integration

The UI expects the backend at `http://localhost:3000`. Update in `auth.service.ts`:

```typescript
private readonly API_URL = 'http://localhost:3000/api/auth';
```

### Expected Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Returns user info, sets cookies |
| `/api/auth/logout` | POST | Clears auth cookies |
| `/api/auth/refresh` | POST | Refreshes access token |
| `/api/auth/me` | GET | Returns current user from cookie |

### Expected Response Format

```typescript
interface AuthResponse {
  accessToken: null;      // null (stored in cookie)
  refreshToken: null;     // null (stored in cookie)
  tokenType: 'Bearer';
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}
```

---

## Environment Configuration

### Development

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Production

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourcompany.com'
};
```

---

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular Security Guide](https://angular.dev/guide/security)
