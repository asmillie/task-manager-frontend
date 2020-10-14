import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { mockRouter } from '../../mocks/mock-router';
import { mockTaskRepositoryService } from '../../mocks/mock-task-repository-service';
import { TableSortDirectiveStub } from '../../mocks/stubs/table-sort-directive.stub';
import { SORT_DIR, SORT_FIELDS } from '../constants';
import { SharedModule } from '../shared/shared.module';
import { TaskComponent } from './add-task/task.component';
import { SearchTasksComponent } from './search-tasks/search-tasks.component';
import { TaskRepositoryService } from './task-repository.service';
import { TaskSortOption } from './task-sort-option';

import { TableSortDirective, TasksComponent } from './tasks.component';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        SharedModule,
        NgbPaginationModule,
      ],
      declarations: [
        TasksComponent,
        TaskComponent,
        TableSortDirective,
        SearchTasksComponent,
      ],
      providers: [
        { provide: TaskRepositoryService, useValue: mockTaskRepositoryService as any },
        { provide: Router, useValue: mockRouter as any },
      ]
    })
    .overrideDirective(
      TableSortDirective,
      {
        set: {
          providers: [
            { provide: TableSortDirective, useClass: TableSortDirectiveStub }
          ]
        }
      }
    )
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initObservables method', () => {
      const initSpy = jest.spyOn(component as any, 'initObservables');

      expect(initSpy).not.toHaveBeenCalled();
      component.ngOnInit();
      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe on subscriptions', () => {
      component.subscriptions = new Subscription();
      const subSpy = jest.spyOn(component.subscriptions, 'unsubscribe');

      expect(component.subscriptions).toBeDefined();
      component.ngOnDestroy();
      expect(subSpy).toHaveBeenCalled();
    });
  });

  describe('onSort', () => {
    it('should call task repository method to set sort options', () => {
      const tso: TaskSortOption = { direction: SORT_DIR.desc, field: SORT_FIELDS.createdAt };

      component.onSort(tso);
      expect(mockTaskRepositoryService.setSortOption).toHaveBeenCalledWith(tso);
    });

    it('should call task repository method to reset search options', () => {
      const tso: TaskSortOption = { direction: '', field: SORT_FIELDS.completed };

      component.onSort(tso);
      expect(mockTaskRepositoryService.resetSearchOpts).toHaveBeenCalled();
    });

    it('should call task repo search method', () => {
      const tso: TaskSortOption = { direction: SORT_DIR.desc, field: SORT_FIELDS.createdAt };

      component.onSort(tso);
      expect(mockTaskRepositoryService.search$).toHaveBeenCalled();
    });

    describe('header method calls', () => {
      const tso: TaskSortOption = { direction: SORT_DIR.desc, field: SORT_FIELDS.createdAt };
      let headerToSort;

      beforeEach(async () => {
        fixture.detectChanges();
        headerToSort = component.headers.find(header => header.field === tso.field);
      });

      it('should call sortCompleted method on header', () => {
        const spy = jest.spyOn(headerToSort, 'sortCompleted');
        component.onSort(tso);
        expect(spy).toHaveBeenCalled();
      });

      it('should call sortFailed method on header', () => {
        mockTaskRepositoryService.search$.mockReturnValue(throwError('error'));
        const spy = jest.spyOn(headerToSort, 'sortFailed');
        component.onSort(tso);
        expect(spy).toHaveBeenCalled();
        expect(component.errorMessage).toEqual('error');
      });
    });

  });

  describe('onDismissAlert', () => {
    it('should clear error message', () => {
      component.errorMessage = 'error to be cleared';

      component.onDismissAlert();
      expect(component.errorMessage).toEqual('');
    });
  });

  describe('onPageChange', () => {
    it('should call task repository refresh method', () => {
      mockTaskRepositoryService.refresh.mockClear();

      component.onPageChange();
      expect(mockTaskRepositoryService.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPageSizeChange', () => {
    it('should call task repository refresh method', () => {
      mockTaskRepositoryService.refresh.mockClear();

      component.onPageSizeChange();
      expect(mockTaskRepositoryService.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadMoreResults', () => {
    it('should call task repository getNextPage method', () => {
      mockTaskRepositoryService.getNextPage$.mockReturnValue(of(true));

      component.loadMoreResults();
      expect(mockTaskRepositoryService.getNextPage$).toHaveBeenCalledTimes(1);
    });
  });

  describe('initObservables', () => {
    it('should assign tasksLoading', (done) => {
      (component as any).initObservables();
      expect(component.tasksLoading).toEqual(mockTaskRepositoryService.loading$);
      component.tasksLoading.pipe(take(1)).subscribe(isLoading => {
        expect(isLoading).toEqual(true);
        done();
      });
    });

    it('should subscribe to tasks$ from tasks repository', () => {
      const subSpy = jest.spyOn(mockTaskRepositoryService.tasks$, 'subscribe');

      (component as any).initObservables();
      expect(subSpy).toHaveBeenCalled();
    });

    it('should subscribe to totalResults$ from tasks repository', () => {
      const subSpy = jest.spyOn(mockTaskRepositoryService.totalResults$, 'subscribe');

      (component as any).initObservables();
      expect(subSpy).toHaveBeenCalled();
    });

    it('should call search$ method from tasks repository', () => {
      (component as any).initObservables();
      expect(mockTaskRepositoryService.search$).toHaveBeenCalled();
    });
  });

  describe('clearUnselectedHeaders', () => {
    it('should call reset method on headers that don\'t match sorting field', () => {
      fixture.detectChanges();
      const tso: TaskSortOption = { direction: SORT_DIR.desc, field: SORT_FIELDS.createdAt };
      const headerSpies = [];
      component.headers.forEach(header => {
        if (header.field !== tso.field) {
          header.direction = SORT_DIR.desc;
          headerSpies.push(
            jest.spyOn(header, 'reset')
          );
        }
      });

      (component as any).clearUnselectedHeaders(tso);
      headerSpies.forEach(spy => {
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
