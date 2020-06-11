import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { UserService } from '../user/user.service';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { mockUserService } from '../../mocks/mock-user-service';
import { SharedModule } from '../shared/shared.module';
import { of, throwError, Subscription } from 'rxjs';
import { User } from '../user/class/user';

const userStub = new User('Bob', 'bob@builder.com');

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('ngOnInit', () => {
    it('should call initForm method', () => {
      const ngOnInitSpy = jest.spyOn(component as any, 'initForm');

      expect(ngOnInitSpy).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(ngOnInitSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on signup subscription', () => {
      component.signupSub = new Subscription();
      const unsubSpy = jest.spyOn(component.signupSub, 'unsubscribe');

      expect(unsubSpy).not.toHaveBeenCalled();
      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should call userService signup method on valid form submission', () => {
      mockUserService.signup$.mockReturnValueOnce(of(userStub));
      component.signupForm.status = 'VALID';
      component.signupForm.controls.name.value = userStub.name;
      component.signupForm.controls.email.value = userStub.email;
      component.signupForm.controls.password.value = 'strongpass';

      expect(mockUserService.signup$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockUserService.signup$).toHaveBeenCalledWith(userStub.name, userStub.email, 'strongpass');
      expect(component.signupSuccess).toEqual(true);
    });

    it('should return without calling userService signup on invalid form submission', () => {
      mockUserService.signup$.mockClear();
      component.signupForm.status = 'INVALID';

      expect(mockUserService.signup$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockUserService.signup$).not.toHaveBeenCalled();
    });

    it('should set errorMessage on error thrown by signup method', () => {
      const errorMessage = 'error';
      mockUserService.signup$.mockReturnValueOnce(throwError(errorMessage));
      component.signupForm.status = 'VALID';
      component.signupForm.controls.name.value = userStub.name;
      component.signupForm.controls.email.value = userStub.email;
      component.signupForm.controls.password.value = 'strongpass';

      expect(mockUserService.signup$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockUserService.signup$).toHaveBeenCalledWith(userStub.name, userStub.email, 'strongpass');
      expect(component.signupSuccess).toEqual(false);
      expect(component.errorMessage).toEqual(errorMessage);
    });
  });

  describe('initForm', () => {
    it('should initialize signup form', () => {
      component.signupForm = undefined;

      expect(component.signupForm).not.toBeDefined();
      (component as any).initForm();
      expect(component.signupForm).toBeInstanceOf(FormGroup);
      expect(component.signupForm.controls.name).toBeDefined();
      expect(component.signupForm.controls.email).toBeDefined();
      expect(component.signupForm.controls.password).toBeDefined();
    });
  });

  describe('get name', () => {
    it('should return value of name from signup form', () => {
      component.signupForm.controls.name = userStub.name;

      expect(component.name).toEqual(userStub.name);
    });
  });

  describe('get email', () => {
    it('should return value of email from signup form', () => {
      component.signupForm.controls.email = userStub.email;

      expect(component.email).toEqual(userStub.email);
    });
  });

  describe('get password', () => {
    it('should return value of password from signup form', () => {
      component.signupForm.controls.password = 'pass';

      expect(component.password).toEqual('pass');
    });
  });
});
