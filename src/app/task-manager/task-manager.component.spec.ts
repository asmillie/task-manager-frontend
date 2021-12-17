import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavComponent } from '../nav/nav.component';

import { TaskManagerComponent } from './task-manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@auth0/auth0-angular';
import { MockAuthService } from '../../mocks/mock-auth-service';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NgbCollapseModule
      ],
      declarations: [
        NavComponent,
        TaskManagerComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('prepareTaskOutlet', () => {
    it('should return false', () => {
      const result = component.prepareTaskOutlet(null);
      expect(result).toEqual(false);
    });

    it('should return url string', () => {
      const mockUrl = 'URL';
      const mockOutlet = {
        isActivated: true,
        activatedRoute: {
          snapshot: {
            url: {
              toString: () => mockUrl
            }
          }
        }
      };

      const result = component.prepareTaskOutlet(mockOutlet as any);
      expect(result).toEqual(mockUrl);
    });
  });
});
