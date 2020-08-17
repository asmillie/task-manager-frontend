import { TestBed } from '@angular/core/testing';

import { TaskQueryOptionsService } from './task-query-options.service';

describe('TaskQueryService', () => {
  let service: TaskQueryOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskQueryOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
