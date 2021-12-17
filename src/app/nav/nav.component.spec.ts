import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { MockAuthService } from '../../mocks/mock-auth-service';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockAuthService = new MockAuthService();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        ReactiveFormsModule,
        NgbDropdownModule,
        NgbCollapseModule,
        RouterTestingModule
      ],
      declarations: [
        NavComponent,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService as any },
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
    it('should call logout method on AuthService', () => {    

      component.logout();
      expect(mockAuthService.logout).toHaveBeenCalledWith({
        returnTo: window.location.origin
      });
    });
  });

  describe('initAuth', () => {
    it('should subscribe to user from AuthService', () => {
      const spy = jest.spyOn(mockAuthService.user$, 'subscribe');

      (component as any).initAuth();
      expect(spy).toHaveBeenCalled();
      expect(component.isLoggedIn).toEqual(true);
    });
  });
});
