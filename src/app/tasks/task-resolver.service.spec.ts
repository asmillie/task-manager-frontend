import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { mockRouter } from '../../mocks/mock-router';
import { TaskRepositoryService } from './task-repository.service';
import { TaskResolverService } from './task-resolver.service';


describe('TaskResolverService', () => {
  let service: TaskResolverService;
  const mockRepo = {
    tasks$: of(null),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskRepositoryService, useValue: mockRepo },
        { provide: Router, useValue: mockRouter },
      ]
    });
    service = TestBed.inject(TaskResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
