import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';

import { mockUser } from '../../mocks/mock-users';
import { SharedModule } from '../shared/shared.module';

jest.mock('@angular/router');

const mockActivatedRoute = {
  data: of({
      user: { mockUser }
    })
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
        { provide: ActivatedRoute, useValue: mockActivatedRoute as any },
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
    // TODO: Test cases
  });
});
