import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { mockHttpService } from '../../mocks/mock-http-service';
import { ErrorHandlingService } from '../error-handling.service';
import { mockErrorHandlingService } from '../../mocks/mock-error-handling-service';
import { of, throwError } from 'rxjs';
import { mockTasks, mockCompletedTasks } from '../../mocks/mock-tasks';
import { TaskQueryOptions } from './task-query-options';
import { environment } from '../../environments/environment';
import { Task } from './task';
import { TaskSortOption } from './task-sort-option';
import { SORT_FIELDS, SORT_DIR } from '../constants';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpService as any },
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService as any}
      ]
    });
    service = TestBed.inject(TasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('search$', () => {
    const API_URL = environment.taskApi.url;
    const GET_TASKS = environment.taskApi.endpoint.tasks.get;

    it('should return list of tasks', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTasks));

      service.search$().subscribe(result => {
        expect(result.length).toEqual(mockTasks.length);
        result.forEach((task, index) => {
          expect(task).toEqual(mockTasks[index]);
        });
        done();
      });
    });

    it('should add completed param to http request', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockCompletedTasks));
      const url = `${API_URL}${GET_TASKS}?completed=true`;
      const taskQuery: TaskQueryOptions = {
        completed: true,
        limit: 50,
      };

      service.taskQueryOptions.next(taskQuery);

      service.search$().subscribe(_ => {
        expect(mockHttpService.post).toHaveBeenCalledWith(url, taskQuery);
        done();
      });
    });

    it('should add search options to http request', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTasks));
      const url = `${API_URL}${GET_TASKS}`;

      const taskQuery: TaskQueryOptions = {
        limit: 5,
        skip: 1,
        sort: [
          { field: SORT_FIELDS.completed, direction: SORT_DIR.desc },
          { field: SORT_FIELDS.createdAt, direction: SORT_DIR.asc },
        ],
      };

      service.taskQueryOptions.next(taskQuery);

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
});
