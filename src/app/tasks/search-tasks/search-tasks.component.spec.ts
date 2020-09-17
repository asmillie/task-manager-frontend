import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTasksComponent } from './search-tasks.component';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Subscription, of } from 'rxjs';
import { mockTasks } from '../../../mocks/mock-tasks';
import { mockTaskRepositoryService } from '../../../mocks/mock-task-repository-service';
import { TaskRepositoryService } from '../task-repository.service';

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
        { provide: TaskRepositoryService, useValue: mockTaskRepositoryService as any },
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
      expect(mockTaskRepositoryService.search$).not.toHaveBeenCalled();
    });

    it('should pass query options to task repository setQueryOption method', () => {
      mockTaskRepositoryService.search$.mockReturnValue(of('valid data'));
      (component as any).initForm();
      component.searchForm.get('complete').setValue(false);

      expect(mockTaskRepositoryService.setQueryOption).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockTaskRepositoryService.setQueryOption).toHaveBeenCalled();
    });

    it('should subscribe to tasksService.search', () => {
      mockTaskRepositoryService.search$.mockClear();
      mockTaskRepositoryService.search$.mockReturnValueOnce(of(mockTasks));
      component.searchForm.get('incomplete').setValue(false);

      expect(mockTaskRepositoryService.search$).not.toHaveBeenCalled();
      component.onSubmit();
      expect(mockTaskRepositoryService.search$).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetForm', () => {
    it('should reset searchForm', () => {
      const resetSpy = jest.spyOn(component.searchForm, 'reset');

      component.resetForm();
      expect(resetSpy).toHaveBeenCalledWith({
        complete: true,
        incomplete: true,
        start_createdAt: '',
        end_createdAt: '',
        start_updatedAt: '',
        end_updatedAt: '',
      });
    });
  });
});
