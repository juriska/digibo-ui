import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login: ReturnType<typeof vi.fn> };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn(),
    };
    routerSpy = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with empty fields and no error', () => {
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
  });

  describe('onLogin', () => {
    it('should show error if username is empty', () => {
      component.username = '';
      component.password = 'pass';
      component.onLogin();

      expect(component.error).toBe('Please enter username and password');
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should show error if password is empty', () => {
      component.username = 'user';
      component.password = '';
      component.onLogin();

      expect(component.error).toBe('Please enter username and password');
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call authService.login and navigate on success', () => {
      authServiceSpy.login.mockReturnValue(of({ username: 'user' }));

      component.username = 'user';
      component.password = 'pass';
      component.onLogin();

      expect(component.loading).toBe(true);
      expect(authServiceSpy.login).toHaveBeenCalledWith('user', 'pass');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should display error message on login failure', () => {
      authServiceSpy.login.mockReturnValue(
        throwError(() => ({ error: { message: 'Invalid credentials' } }))
      );

      component.username = 'user';
      component.password = 'wrong';
      component.onLogin();

      expect(component.error).toBe('Invalid credentials');
      expect(component.loading).toBe(false);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should display default error when no message in response', () => {
      authServiceSpy.login.mockReturnValue(
        throwError(() => ({ error: {} }))
      );

      component.username = 'user';
      component.password = 'wrong';
      component.onLogin();

      expect(component.error).toBe('Login failed. Please try again.');
    });
  });

  describe('quickLogin', () => {
    it('should call authService.login with provided credentials', () => {
      authServiceSpy.login.mockReturnValue(of({ username: 'user1' }));

      component.quickLogin('user1', 'password1');

      expect(component.loading).toBe(true);
      expect(authServiceSpy.login).toHaveBeenCalledWith('user1', 'password1');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show backend error on quick login failure', () => {
      authServiceSpy.login.mockReturnValue(
        throwError(() => ({ error: {} }))
      );

      component.quickLogin('user1', 'password1');

      expect(component.error).toBe('Login failed. Is the backend running?');
      expect(component.loading).toBe(false);
    });
  });
});
