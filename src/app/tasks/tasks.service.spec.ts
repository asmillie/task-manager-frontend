import { TestBed } from '@angular/core/testing';

import { TasksService } from './tasks.service';
import { HttpClient } from '@angular/common/http';
import { mockHttpService } from '../../mocks/mock-http-service';
import { ErrorHandlingService } from '../error-handling.service';
import { mockErrorHandlingService } from '../../mocks/mock-error-handling-service';

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
});
