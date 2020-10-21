import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavComponent } from './nav.component';
import { AuthService } from '../auth/auth.service';
import { mockAuthService } from '../../mocks/mock-auth-service';
import { LoginComponent } from '../auth/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { mockRouter } from '../../mocks/mock-router';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule,
      ],
      declarations: [
        NavComponent,
        LoginComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService as any },
        { provide: Router, useValue: mockRouter as any },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call initAuth()', () => {
      const initAuthSpy = jest.spyOn(component as any, 'initAuth');

      expect(initAuthSpy).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(initAuthSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on user subscription', () => {
      component.userSub = new Subscription();
      const unsubSpy = jest.spyOn(component.userSub, 'unsubscribe');

      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should subscribe to authService.logout$', () => {
      mockAuthService.logout$.mockReturnValue(of(true));
      const spy = jest.spyOn(mockAuthService.logout$(), 'subscribe');

      component.logout();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('initAuth', () => {
    it('should subscribe to authService user subject', () => {
      const subSpy = jest.spyOn(mockAuthService.userSubject, 'subscribe');

      (component as any).initAuth();
      expect(subSpy).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
    });
  });
});
