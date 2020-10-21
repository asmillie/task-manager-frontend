import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { mockRouter } from '../../mocks/mock-router';
import { mockTaskRepositoryService } from '../../mocks/mock-task-repository-service';
import { TaskRepositoryService } from './task-repository.service';

import { TaskResolverService } from './task-resolver.service';

describe('TaskResolverService', () => {
  let service: TaskResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskRepositoryService, useValue: mockTaskRepositoryService },
        { provide: Router, useValue: mockRouter },
      ]
    });
    service = TestBed.inject(TaskResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
