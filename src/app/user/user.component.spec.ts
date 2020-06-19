import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription, throwError } from 'rxjs';

import { mockUser } from '../../mocks/mock-users';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { mockUserService } from '../../mocks/mock-user-service';
import { UserUpdateOpts } from './class/user-update-opts';

jest.mock('@angular/router');

const mockActivatedRoute = {
  data: of({
      user: mockUser
    })
};

const mockRouter = {
  createUrlTree: jest.fn()
};

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        SharedModule
      ],
      declarations: [ UserComponent ],
      providers: [
        { provide: UserService, useValue: mockUserService as any },
        { provide: ActivatedRoute, useValue: mockActivatedRoute as any },
        { provide: Router, useValue: mockRouter as any }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call methods to initialize user and form', () => {
      const userSpy = jest.spyOn(component as any, 'initUser');
      const formSpy = jest.spyOn(component as any, 'initForm');

      component.ngOnInit();
      expect(userSpy).toHaveBeenCalled();
      expect(formSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on user subscription', () => {
      component.userSub = new Subscription();
      const unsubSpy = jest.spyOn(component.userSub, 'unsubscribe');

      expect(unsubSpy).not.toHaveBeenCalled();
      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {

    it('should not call getUserUpdateOpts()', () => {
      const updateOptsSpy = jest.spyOn(component as any, 'getUserUpdateOpts');

      component.userForm.get('name').setValue(null);
      expect(component.userForm.status).toEqual('INVALID');
      expect(updateOptsSpy).not.toHaveBeenCalled();
      component.onSubmit();
      expect(updateOptsSpy).not.toHaveBeenCalled();
    });

    describe('calls to User Service', () => {
      const newEmail = 'new.email@addr.com';

      beforeEach(() => {
        component.user = mockUser;
        (component as any).initForm();
        component.userForm.markAsDirty();
        mockUserService.update$.mockClear();
      });

      it('should not call userService.update$()', () => {
        const updateOptsSpy = jest.spyOn(component as any, 'getUserUpdateOpts').mockReturnValue(null);

        expect(component.userForm.status).toEqual('VALID');
        component.onSubmit();
        expect(updateOptsSpy).toHaveBeenCalled();
        expect(mockUserService.update$).not.toHaveBeenCalled();
      });

      it('should call userService update method with updates to be performed', () => {
        mockUserService.update$.mockReturnValue(of({
          ...mockUser,
          email: { address: newEmail }
        }));

        jest.spyOn(component as any, 'getUserUpdateOpts').mockReturnValue({
          email: { address: newEmail }
        });

        expect(mockUserService.update$).not.toHaveBeenCalled();
        component.onSubmit();
        expect(mockUserService.update$).toHaveBeenCalledWith({ email: { address: newEmail }}, mockUser.token);
      });

      it('should set errorMessage', () => {
        mockUserService.update$.mockReturnValue(throwError('Update Error'));
        jest.spyOn(component as any, 'getUserUpdateOpts').mockReturnValue({
          email: { address: newEmail }
        });

        expect(mockUserService.update$).not.toHaveBeenCalled();
        component.onSubmit();
        expect(component.errorMessage).toEqual('Update Error');
      });
    });
  });

  describe('initUser', () => {
    it('should subscribe to route data and intialize user', () => {
      const routeSpy = jest.spyOn(mockActivatedRoute.data, 'subscribe');

      expect(routeSpy).not.toHaveBeenCalled();
      (component as any).initUser();
      expect(routeSpy).toHaveBeenCalled();
      expect(component.user).toEqual(mockUser);
    });
  });

  describe('initForm', () => {
    it('should initialize user form', () => {
      component.userForm = null;
      component.user = mockUser;

      (component as any).initForm();
      expect(component.userForm).toBeInstanceOf(FormGroup);
      expect(component.userForm.get('name').value).toEqual(mockUser.name);
      expect(component.userForm.get('email').value).toEqual(mockUser.email);
    });
  });

  describe('getUserUpdateOpts', () => {
    it('should return object containing user fields that have been changed', () => {
      const newName = 'Susan Strong';
      const newEmail = 'updated.email@website.co.uk';
      const newPass = 'new.strong.password';
      const updateOpts: UserUpdateOpts = {
        name: newName,
        email: { address: newEmail },
        password: newPass
      };

      const nameField = component.name;
      const emailField = component.email;
      const passField = component.password;
      const pass2Field = component.password2;
      nameField.setValue(newName);
      nameField.markAsDirty();
      emailField.setValue(newEmail);
      emailField.markAsDirty();
      passField.setValue(newPass);
      passField.markAsDirty();
      pass2Field.setValue(newPass);
      pass2Field.markAsDirty();

      expect(nameField.valid).toEqual(true);
      expect(emailField.valid).toEqual(true);
      expect(passField.valid).toEqual(true);
      const result = (component as any).getUserUpdateOpts();
      expect(result).toEqual(updateOpts);
    });
  });
});
