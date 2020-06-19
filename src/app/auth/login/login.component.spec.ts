import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { mockAuthService } from '../../../mocks/mock-auth-service';
import { Router } from '@angular/router';
import { mockRouter } from '../../../mocks/mock-router';
import { SharedModule } from '../../shared/shared.module';
import { Subscription, of, throwError } from 'rxjs';
import { mockUser } from '../../../mocks/mock-users';
import { FormGroup } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: mockAuthService as any },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initForm()', () => {
      const initFormSpy = jest.spyOn(component as any, 'initForm');

      expect(initFormSpy).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(initFormSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on login subscription', () => {
      component.loginSub = new Subscription();
      const unsubSpy = jest.spyOn(component.loginSub, 'unsubscribe');

      expect(component.loginSub).toBeDefined();
      expect(unsubSpy).not.toHaveBeenCalled();
      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should not call authService.login$()', () => {
      expect(component.loginForm.status).toEqual('INVALID');
      component.onSubmit();
      expect(mockAuthService.login$).not.toHaveBeenCalled();
    });

    describe('calls to authService.login$', () => {
      const email = 'current.user@email.com';
      const pass = 'strongpassword';

      beforeEach(() => {
        component.email.setValue(email);
        component.password.setValue(pass);
      });

      it('should submit form data to authService.login$()', () => {
        mockAuthService.login$.mockReturnValueOnce(of(mockUser));

        component.onSubmit();
        expect(mockAuthService.login$).toHaveBeenCalledWith(email, pass);
        expect(component.isLoading).toEqual(false);
      });

      it('should redirect to user feature', () => {
        mockAuthService.login$.mockReturnValueOnce(of(mockUser));

        component.onSubmit();
        expect(component.isLoading).toEqual(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/user']);
      });

      it('should set error message', () => {
        mockAuthService.login$.mockReturnValueOnce(throwError('error'));

        expect(component.errMessage).toEqual('');
        component.onSubmit();
        expect(component.errMessage).toEqual('error');
        expect(component.isLoading).toEqual(false);
      });
    });
  });

  describe('dismissAlert', () => {
    it('should clear error message', () => {
      component.errMessage = 'error';

      expect(component.errMessage).toEqual('error');
      component.dismissAlert();
      expect(component.errMessage).toEqual('');
    });
  });

  describe('initForm', () => {
    it('should initialize login form', () => {
      component.loginForm = undefined;

      (component as any).initForm();
      expect(component.loginForm).toBeInstanceOf(FormGroup);
      expect(component.loginForm.contains('email')).toEqual(true);
      expect(component.loginForm.contains('password')).toEqual(true);
    });
  });
});
