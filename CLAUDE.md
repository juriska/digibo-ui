# Project: DigiBo — Bank Backoffice System

## Tech Stack

- **Framework:** Angular 21.1 (zoneless, standalone-by-default)
- **Language:** TypeScript 5.9 (strict mode)
- **Build:** `@angular/build:application` (esbuild-based)
- **Testing:** Vitest 4 via `@angular/build:unit-test`
- **Styles:** SCSS (inline styles in components)
- **Shared UI Library:** `@citadele/common-parts` v1.13.4 (local, in `./common-parts/`)
- **Reactive:** Angular Signals + RxJS 7.8
- **Routing:** Standalone, lazy-loaded, dynamic role-based routes
- **Auth:** httpOnly cookie-based (no localStorage tokens)
- **Change detection:** Zoneless (`provideZonelessChangeDetection()`, no zone.js)

---

## Project Structure

```
src/app/
├── core/                   # Singletons: services, guards, interceptors, models, config
│   ├── config/             # Route configs, feature flags, constants
│   ├── guards/             # Functional route guards (authGuard, roleGuard, etc.)
│   ├── interceptors/       # Functional HTTP interceptors
│   ├── models/             # TypeScript interfaces and types
│   └── services/           # Application-wide singleton services
├── features/               # Feature modules (one folder per feature)
│   ├── dashboard/
│   ├── login/
│   ├── orders/
│   ├── payments/
│   └── unauthorized/
├── layout/                 # Layout components (main-layout, sidebar, header)
├── app.component.ts        # Root component
├── app.config.ts           # Application providers
└── app.routes.ts           # Base route definitions
```

### Where to put new code

| Type | Location | Notes |
|------|----------|-------|
| New feature | `src/app/features/<feature-name>/` | Each feature has its own folder |
| Shared service | `src/app/core/services/` | Must be `providedIn: 'root'` |
| Route guard | `src/app/core/guards/` | Functional `CanActivateFn` |
| HTTP interceptor | `src/app/core/interceptors/` | Functional `HttpInterceptorFn` |
| Interface / type | `src/app/core/models/` | One file per domain entity |
| Route config | `src/app/core/config/` | Feature route definitions |
| Reusable UI widget | `./common-parts/` | Separate library package |

---

## Angular Best Practices (21+)

### 1. Components — Standalone by Default

All components are standalone by default in Angular 21. Do NOT write `standalone: true` — it is the default and redundant. Never use NgModules for declaring components.

```typescript
@Component({
  selector: 'app-my-feature',
  imports: [RouterModule, FormsModule],
  template: `...`,
  styles: `...`
})
export class MyFeatureComponent { }
```

**Rules:**
- Do NOT add `standalone: true` — it is the default since Angular 19
- Do NOT import `CommonModule` — use built-in control flow (`@if`, `@for`) instead
- Use inline `template` and `styles` for small/medium components
- Use `templateUrl` and `styleUrl` only when template exceeds ~50 lines
- Every component must declare its own `imports` array
- Import only what the template actually uses

### 2. Dependency Injection — Use `inject()` Function

Always prefer the `inject()` function over constructor injection.

```typescript
// GOOD
export class MyComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
}

// BAD — avoid constructor injection
export class MyComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
}
```

### 3. Signals — Primary Reactive Primitive

Use Angular Signals as the primary reactive state mechanism. Use RxJS only for async streams (HTTP, WebSockets, complex event pipelines).

```typescript
// Component state — use signals
export class MyComponent {
  items = signal<Item[]>([]);
  loading = signal(false);
  selectedItem = signal<Item | null>(null);

  // Derived state — use computed
  itemCount = computed(() => this.items().length);
  hasSelection = computed(() => this.selectedItem() !== null);

  // Linked signal — derived state with local override
  currentPage = linkedSignal(() => this.selectedItem() ? 1 : 0);
}
```

```typescript
// Signal-based component I/O (preferred over @Input/@Output decorators)
export class ItemCardComponent {
  // Required input
  item = input.required<Item>();

  // Optional input with default
  showDetails = input(false);

  // Two-way binding with model()
  selected = model(false);

  // Output
  deleted = output<Item>();
}
```

```typescript
// Service state — use signals with readonly exposure
@Injectable({ providedIn: 'root' })
export class MyService {
  private _data = signal<Data[]>([]);
  private _loading = signal(false);

  // Expose as readonly to consumers
  readonly data = this._data.asReadonly();
  readonly loading = this._loading.asReadonly();

  // Computed signals for derived state
  readonly isEmpty = computed(() => this._data().length === 0);
}
```

**Signal rules:**
- Use `signal()` for mutable state
- Use `computed()` for derived/calculated state
- Use `linkedSignal()` for derived state that can be locally overridden (e.g., reset on parent change)
- Use `effect()` sparingly — only for side effects (logging, localStorage sync)
- Expose signals as `asReadonly()` from services
- Prefer `signal()` over `BehaviorSubject` for new code
- Read signal values in templates with `signalName()` syntax
- Use `input()` / `output()` / `model()` signal-based APIs for component I/O (preferred over `@Input`/`@Output` decorators)
- Use `resource()` / `httpResource()` for async data loading tied to signal state

### 4. Control Flow — Use Built-in Syntax

Use Angular's built-in control flow (`@if`, `@for`, `@switch`). The legacy `*ngIf`/`*ngFor`/`[ngSwitch]` structural directives are **deprecated** in Angular 21.

```html
@if (loading()) {
  <app-loader />
} @else if (error()) {
  <div class="error">{{ error() }}</div>
} @else {
  @for (item of items(); track item.id) {
    <app-item-card [item]="item" />
  } @empty {
    <app-no-data message="No items found" />
  }
}

@switch (status()) {
  @case ('active') { <span class="badge-active">Active</span> }
  @case ('inactive') { <span class="badge-inactive">Inactive</span> }
  @default { <span>Unknown</span> }
}
```

**Rules:**
- Always provide `track` expression in `@for` (use unique identifier like `item.id`)
- Use `@empty` block for empty-state messaging
- NEVER use `*ngIf` / `*ngFor` / `[ngSwitch]` — they are deprecated
- No need to import `CommonModule` — built-in control flow works without it

### 5. Routing — Lazy Loading with Dynamic Registration

```typescript
// Lazy-load components in routes (not modules)
{
  path: 'orders',
  loadComponent: () => import('./features/orders/orders.component')
    .then(m => m.OrdersComponent),
  canActivate: [roleGuard],
  data: { roles: ['RBOFFORDERS'] }
}
```

**Routing rules:**
- Always lazy-load feature components with `loadComponent`
- Use functional guards (`CanActivateFn`), never class-based guards
- Feature routes are registered dynamically via `DynamicRouteService` based on user roles
- Public routes (login, unauthorized) go in `app.routes.ts`
- Protected feature routes go in `core/config/route-config.ts`

### 6. Services

```typescript
// Traditional pattern (Observable-based) — still valid for complex pipelines
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/data';

  private _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();

  loadItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.API_URL).pipe(
      tap(items => this._items.set(items)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
```

```typescript
// Signal-based pattern with httpResource — preferred for simple CRUD
export class OrdersComponent {
  private selectedId = signal<string | null>(null);

  // Automatically fetches when selectedId changes
  private orderResource = httpResource<Order>(() =>
    this.selectedId() ? `/api/orders/${this.selectedId()}` : undefined
  );

  order = this.orderResource.value;       // Signal<Order | undefined>
  loading = this.orderResource.isLoading;  // Signal<boolean>
  error = this.orderResource.error;        // Signal<unknown>
}
```

**Service rules:**
- Always use `providedIn: 'root'` for singleton services
- Keep API URLs as private readonly constants
- Use `withCredentials: true` for all API calls (handled by interceptor)
- For simple data fetching, prefer `httpResource()` (signal-driven, no manual subscribe)
- For complex pipelines (retries, debounce, switchMap), use `Observable` + `HttpClient`
- Use signals for state; expose as `readonly`
- `HttpClient` is provided by default in Angular 21 — no need for `provideHttpClient()` in basic cases (we still use it for `withInterceptors()`)

### 7. HTTP & Interceptors

```typescript
// Functional interceptor pattern
export const myInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(SomeService);

  const modifiedReq = req.clone({
    withCredentials: true,
    headers: req.headers.set('X-Custom', 'value')
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle errors globally
      return throwError(() => error);
    })
  );
};
```

**Rules:**
- Register interceptors in `app.config.ts` via `withInterceptors([...])`
- Use functional `HttpInterceptorFn`, never class-based interceptors
- All requests include `withCredentials: true` (set by `authInterceptor`)
- Handle 401/403 globally in the auth interceptor

### 8. Guards

```typescript
// Functional guard pattern
export const myGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

**Rules:**
- Always use functional `CanActivateFn` — never class-based `CanActivate`
- Inject dependencies with `inject()` inside the guard function body
- Return `boolean` or `UrlTree`, not `Observable<boolean>` when possible

### 9. TypeScript Conventions

```typescript
// Interfaces for data models
export interface User {
  userId: string;
  username: string;
  roles: string[];
  permissions: string[];
}

// Use readonly for immutable properties
export interface Config {
  readonly apiUrl: string;
  readonly maxRetries: number;
}
```

**TypeScript rules:**
- Strict mode is enabled — respect all strict checks
- Use `interface` for data shapes; use `type` for unions, intersections, and mapped types
- Prefer `readonly` modifiers where possible
- Use explicit return types on public methods
- Avoid `any` — use `unknown` and narrow with type guards
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Keep `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride` enabled

### 10. Template Best Practices

- Prefer calling signals in templates: `{{ mySignal() }}` not `{{ myProperty }}`
- Use `@if` / `@for` / `@switch` for control flow (see section 4)
- Use `@let` for template-local variables: `@let user = authService.user();`
- Keep templates declarative — avoid complex logic, move it to `computed()` signals
- Use `[class.active]="isActive()"` for conditional CSS classes
- Use `(click)="handler()"` — never bind to getters that compute on every CD cycle
- Keep event handlers simple — call a method, don't put logic inline

### 11. Performance

- Lazy-load all feature components via `loadComponent`
- App is **zoneless** (`provideZonelessChangeDetection()`) — change detection is signal-driven, no zone.js overhead
- With zoneless, `OnPush` is not needed — but it doesn't hurt to add it for clarity
- Prefer signals over `async` pipe for better performance
- Use `track` in `@for` loops for efficient DOM recycling
- Avoid unnecessary `subscribe()` — prefer declarative signal/computed chains
- Consider `resource()` / `httpResource()` for signal-driven async data loading
- Consider `DestroyRef` + `takeUntilDestroyed()` for subscription cleanup

### 12. Subscription Management

```typescript
// Preferred: takeUntilDestroyed() in field initializer (injection context)
export class MyComponent {
  private data$ = inject(DataService).data$.pipe(
    takeUntilDestroyed()  // no DestroyRef needed when called in injection context
  );
}

// If subscribing in ngOnInit or other methods (outside injection context):
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.someObservable$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      // handle data
    });
  }
}
```

**Rules:**
- Use `takeUntilDestroyed()` without arguments in field initializers (injection context) — simplest pattern
- Use `takeUntilDestroyed(this.destroyRef)` when subscribing outside the injection context (ngOnInit, callbacks)
- Never manually `unsubscribe` unless absolutely necessary
- Prefer signals over subscriptions when possible
- For one-off HTTP calls, manual unsubscription is optional (they auto-complete)
- Consider `resource()` / `httpResource()` to avoid manual subscriptions entirely

---

## UI Components

### `@citadele/common-parts` — Always Use First

`@citadele/common-parts` is an internal UI library maintained by another team. It is installed as a local dependency (`file:common-parts/dist/common-parts`). The source lives in `./common-parts/` but **we do not modify it** — we only consume the built package.

**Import from:** `@citadele/common-parts`

```typescript
import { ButtonComponent, InputComponent, TableComponent } from '@citadele/common-parts';
```

**Available components:**

| Category | Components |
|----------|-----------|
| **Buttons** | `ButtonComponent`, `IconButtonComponent`, `ActiveButtonComponent`, `BackButtonComponent`, `CancelButtonComponent`, `DropdownButtonComponent`, `QuickActionComponent` |
| **Inputs** | `InputComponent`, `DateInputComponent`, `FulldateInputComponent`, `CurrencyInputComponent`, `PasswordInputComponent`, `OtpInputComponent`, `SelectComponent`, `SelectTableComponent`, `DropdownComponent`, `RadioComponent`, `VerticalInputComponent`, `CheckboxDropdownComponent` |
| **Layout** | `SideNavComponent`, `SidePanelComponent`, `PageCardComponent`, `BreadcrumbsComponent`, `TabsComponent`, `AccordionComponent`, `AccordionPanelComponent`, `ExpansionPanelComponent`, `CollapsibleComponent`, `HorizontalContainerComponent` |
| **Data display** | `TableComponent`, `PaginatorComponent`, `BadgeComponent`, `CircleBadgeComponent`, `MessageComponent`, `NotificationComponent`, `LoaderComponent`, `LoadingOverlayComponent`, `NoDataComponent`, `ReadOnlyComponent` |
| **Cards** | `EntityCardComponent`, `PaymentDetailCardComponent`, `MetaCardComponent`, `MetricBoxComponent`, `RadioCardComponent`, `LinkCardComponent`, `LinkCardCollectionComponent` |
| **Complex** | `ModalHostComponent`, `FormBakerComponent`, `FormFieldComponent`, `ContextMenuComponent` |
| **Atoms** | `AlertNotificationComponent`, `ChartComponent`, `EmptyStateComponent`, `InlineMetricComponent`, `SkeletonComponent`, `StepperComponent`, `TooltipComponent`, `WidgetBannerComponent` |

**Available directives:**
- `HasPrivilegesDirective` — show/hide elements based on user permissions
- `ClickOutsideDirective` — detect clicks outside an element
- `FitInViewportDirective` — fit element within viewport
- `ClickStopPropogationDirective` — stop event propagation
- `TooltipDirective` — tooltip behavior

**Available services:**
- `ModalHostService` — open/close modals programmatically
- `SidePanelService` — manage side panel
- `PrivilegesService` — check user privileges
- `LoaderService` — global loader state
- `LocaleService` — i18n (supports EN, EE, LT, LV, RU)
- `BreakpointObserverService` — responsive breakpoint detection
- `PageTransferService` — page navigation events

**Available pipes:** `AmountWithSpacesPipe`

**Available validators:** `AmountValidators`, `DateRangeValidator`

### When to use Angular Material

Only use Angular Material components when `@citadele/common-parts` does **not** have a suitable component for the use case. If Angular Material is needed, install it separately (`@angular/material`).

---

## Authentication & Security

- Auth is cookie-based (`httpOnly`) — NEVER store tokens in localStorage or sessionStorage
- All HTTP requests include `withCredentials: true` (interceptor handles this)
- Routes are registered dynamically based on user roles after login
- Use `authGuard` for authentication checks, `roleGuard` for role-based access
- Role data is passed via route `data: { roles: ['ROLE_NAME'] }`
- Session restored automatically via `/api/auth/me` on app init

---

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Component | PascalCase + `Component` suffix | `OrdersListComponent` |
| Service | PascalCase + `Service` suffix | `OrdersService` |
| Guard | camelCase + `Guard` suffix | `roleGuard` |
| Interceptor | camelCase + `Interceptor` suffix | `authInterceptor` |
| Interface | PascalCase, no prefix | `User`, `Order`, `AuthResponse` |
| Signal | camelCase | `isLoading`, `items`, `selectedItem` |
| Private signal | `_` prefix | `_isLoading`, `_items` |
| File name | kebab-case | `orders-list.component.ts` |
| Selector | `app-` prefix | `app-orders-list` |

---

## Testing

- Test runner: Vitest 4 (via `@angular/build:unit-test`)
- Test files: `*.spec.ts` alongside the source file
- Tests are currently skipped by default in schematics
- When writing tests, prefer `TestBed` with standalone component setup
- Mock services using `vi.fn()` or provide stubs
- Run tests with `npx ng test`
- **Zoneless testing:** Use `await fixture.whenStable()` instead of `fixture.detectChanges()` for async operations
- Use `provideHttpClient()` + `provideHttpClientTesting()` with `HttpTestingController` for HTTP tests
- Run guards in tests with `TestBed.runInInjectionContext(() => guard(route, state))`

---

## Common Patterns in This Project

### Adding a New Feature

1. Create folder: `src/app/features/<feature-name>/`
2. Create component: `<feature-name>.component.ts` (standalone, inline template/styles)
3. Add route config in `src/app/core/config/route-config.ts` with required roles
4. The `DynamicRouteService` will register routes automatically based on user roles

### Adding a New API Service

1. Create service in `src/app/core/services/<name>.service.ts`
2. Use `@Injectable({ providedIn: 'root' })`
3. Inject `HttpClient` via `inject(HttpClient)`
4. Manage state with signals, expose as `readonly`
5. Return `Observable` from HTTP methods

### Creating Protected Routes

```typescript
// In route-config.ts
{
  path: 'my-feature',
  loadComponent: () => import('../../features/my-feature/my-feature.component')
    .then(m => m.MyFeatureComponent),
  canActivate: [roleGuard],
  data: { roles: ['REQUIRED_ROLE'] }
}
```
