import { TestBed, tick } from '@angular/core/testing';

import { TaskRepositoryService, TaskPaginationData, TaskQuery } from './task-repository.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { mockHttpService } from '../../mocks/mock-http-service';
import { ErrorHandlingService } from '../error-handling.service';
import { mockErrorHandlingService } from '../../mocks/mock-error-handling-service';
import { of, throwError } from 'rxjs';
import { mockTasks } from '../../mocks/mock-tasks';
import { TaskQueryOptions } from './task-query-options';
import { environment } from '../../environments/environment';
import { Task } from './task';
import { TaskSortOption } from './task-sort-option';
import { SORT_FIELDS, SORT_DIR } from '../constants';

const mockTaskPaginationData: TaskPaginationData = {
  totalResults: mockTasks.length,
  totalPages: 1,
  currentPage: 1,
  pageSize: 100,
  tasks: mockTasks,
};

describe('TaskRepositoryService', () => {
  let service: TaskRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpService as any },
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService as any}
      ]
    });
    service = TestBed.inject(TaskRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNextPage$', () => {
    it('should return true', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTaskPaginationData));
      (service as any)._currentPage = 1;
      (service as any)._totalPages = 2;

      service.getNextPage$().subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should return false', (done) => {
      (service as any)._currentPage = 2;
      (service as any)._totalPages = 2;

      service.getNextPage$().subscribe(result => {
        expect(result).toBeFalsy();
        done();
      });
    });
  });

  describe('search$', () => {
    const API_URL = environment.taskApi.url;
    const GET_TASKS = environment.taskApi.endpoint.tasks.get;

    it('should return true', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTaskPaginationData));

      service.search$().subscribe(result => {
        expect(result).toBeTruthy();
        done();
      });
    });

    it('should add search options to http request', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTaskPaginationData));
      const url = `${API_URL}${GET_TASKS}`;

      const taskQuery: TaskQuery = {
        limit: 5,
        page: 1,
        sort: [
          { field: SORT_FIELDS.completed, direction: SORT_DIR.desc },
          { field: SORT_FIELDS.createdAt, direction: SORT_DIR.asc },
        ],
      };

      service.setQueryOption(taskQuery);

      service.search$().subscribe(_ => {
        expect(mockHttpService.post).toHaveBeenCalledWith(url, taskQuery);
        done();
      });
    });

    it('should return error message', (done) => {
      const httpError = new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));
      mockErrorHandlingService.handleHttpError$.mockReturnValueOnce(throwError('error'));

      service.search$().subscribe({
        error: (err) => {
          expect(err).toEqual('error');
          done();
        }
      });
    });
  });

  describe('add$', () => {
    it('should return task on successful post request', (done) => {
      const mockTask = new Task('description', false);
      mockHttpService.post.mockReturnValueOnce(of(mockTask));

      service.add$(mockTask).subscribe(result => {
        expect(result).toBeInstanceOf(Task);
        expect(result).toEqual(mockTask);
        done();
      });
    });

    it('should return error message', (done) => {
      const httpError = new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });
      mockHttpService.post.mockReturnValueOnce(throwError(httpError));
      mockErrorHandlingService.handleHttpError$.mockReturnValueOnce(throwError('error'));

      service.add$(mockTasks[0]).subscribe({
        error: (err) => {
          expect(err).toEqual('error');
          done();
        }
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tasks subject with current tasks value', () => {
      const tasksSubject = (service as any)._tasks$;
      tasksSubject.next(mockTasks);
      const tasksSpy = jest.spyOn(tasksSubject, 'next');

      expect(tasksSpy).not.toHaveBeenCalled();
      service.refresh();
      expect(tasksSpy).toHaveBeenCalledWith(mockTasks);
    });
  });

  describe('resetSearchOpts', () => {
    it('should set query options to defaults', (done) => {
      const completed = true;
      const startUpdatedAt = new Date();
      const tqo: TaskQueryOptions = {
        completed,
        startUpdatedAt,
      };
      (service as any)._taskQueryOptions$.next(tqo);

      service.resetSearchOpts();
      (service as any)._taskQueryOptions$.subscribe(opts => {
        expect(opts.completed).not.toBeDefined();
        expect(opts.startUpdatedAt).not.toBeDefined();
        done();
      });
    });
  });

  describe('setSortOption', () => {
    it('should set sort option on task query options', (done) => {
      const tso: TaskSortOption = {
        field: SORT_FIELDS.createdAt,
        direction: SORT_DIR.asc
      };

      service.setSortOption(tso);
      (service as any)._taskQueryOptions$.subscribe(tqo => {
        expect(tqo.sort[0]).toEqual(tso);
        done();
      });
    });
  });

  describe('setQueryOption', () => {
    it('should add query option to current options', () => {
      const completed = true;
      const tqo: TaskQueryOptions = {
        completed,
      };
      const currentOpts = (service as any)._taskQueryOptions$.getValue();

      expect(currentOpts.completed).not.toBeDefined();
      service.setQueryOption(tqo);
      const result = (service as any)._taskQueryOptions$.getValue();
      expect(result.completed).toBeDefined();
      expect(result.completed).toEqual(completed);
    });
  });
});
