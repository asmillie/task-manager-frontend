import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockHttpService } from '../../mocks/mock-http-service';
import { NavComponent } from '../nav/nav.component';

import { TaskManagerComponent } from './task-manager.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [
        NavComponent,
        TaskManagerComponent,
      ],
      providers: [
        { provide: HttpClient, useValue: mockHttpService },
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
