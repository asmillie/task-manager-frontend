import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTasksComponent } from './search-tasks.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TasksService } from '../tasks.service';
import { mockTasksService } from '../../../mocks/mock-tasks-service';
import { Subscription, of } from 'rxjs';
import { mockTasks } from '../../../mocks/mock-tasks';

describe('SearchTasksComponent', () => {
  let component: SearchTasksComponent;
  let fixture: ComponentFixture<SearchTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTasksComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
      ],
      providers: [
        { provide: TasksService, useValue: mockTasksService as any },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initForm', () => {
      const formSpy = jest.spyOn((component as any), 'initForm');

      component.ngOnInit();
      expect(formSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on search subscription', () => {
      component.searchSub = new Subscription();
      const unsubSpy = jest.spyOn(component.searchSub, 'unsubscribe');

      expect(unsubSpy).not.toHaveBeenCalled();
      component.ngOnDestroy();
      expect(unsubSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should return without calling search on invalid form', () => {
      component.searchForm.get('start_createdAt').setValue('invalid date');

      expect(component.searchForm.status).not.toEqual('VALID');
      component.onSubmit();
      expect(mockTasksService.search$).not.toHaveBeenCalled();
    });

    it('should set task query options', () => {
      const tqoSpy = jest.spyOn(mockTasksService.taskQueryOptions, 'next');
      mockTasksService.search$.mockReturnValue(of('valid data'));
      (component as any).initForm();
      component.searchForm.get('complete').setValue(false);

      expect(tqoSpy).not.toHaveBeenCalled();
      component.onSubmit();
      expect(tqoSpy).toHaveBeenCalled();
    });

    it('should subscribe to tasksService.search', () => {
      mockTasksService.search$.mockClear();
      mockTasksService.search$.mockReturnValueOnce(of(mockTasks));
      component.searchForm.get('incomplete').setValue(false);

      expect(mockTasksService.search$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockTasksService.search$).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetForm', () => {
    it('should reset searchForm', () => {
      const resetSpy = jest.spyOn(component.searchForm, 'reset');

      component.resetForm();
      expect(resetSpy).toHaveBeenCalledWith({
        complete: true,
        incomplete: true,
      });
    });
  });
});
