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

  describe('getAll$', () => {
    const API_URL = environment.taskApi.url;
    const TASKS_ENDPOINT = environment.taskApi.endpoint.tasks;

    it('should return list of tasks', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTasks));

      service.getAll$().subscribe(result => {
        expect(result.length).toEqual(mockTasks.length);
        result.forEach((task, index) => {
          expect(task).toEqual(mockTasks[index]);
        });
        done();
      });
    });

    it('should add completed param to http request', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockCompletedTasks));
      const url = `${API_URL}${TASKS_ENDPOINT}?completed=true`;

      service.getAll$(true).subscribe(_ => {
        expect(mockHttpService.post).toHaveBeenCalledWith(url, undefined);
        done();
      });
    });

    it('should add query options to http request', (done) => {
      mockHttpService.post.mockReturnValueOnce(of(mockTasks));
      const url = `${API_URL}${TASKS_ENDPOINT}`;

      const tqo: TaskQueryOptions = {};
      tqo.limit = 5;
      tqo.skip = 1;
      tqo.sort = [
        { field: 'completed', direction: 'asc' },
        { field: 'createdAt', direction: 'desc' },
      ];

      service.getAll$(undefined, tqo).subscribe(_ => {
        expect(mockHttpService.post).toHaveBeenCalledWith(url, tqo);
        done();
      });
    });
  });

  it('should return error message', (done) => {
    const httpError = new HttpErrorResponse({ error: 'Internal Server Error', status: 500 });
    mockHttpService.post.mockReturnValueOnce(throwError(httpError));
    mockErrorHandlingService.handleHttpError$.mockReturnValueOnce(throwError('error'));

    service.getAll$().subscribe({
      error: (err) => {
        console.log(err);
        done();
      }
    });
  });
});
