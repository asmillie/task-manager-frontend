import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { mockRouter } from '../../mocks/mock-router';
import { mockTasks } from '../../mocks/mock-tasks';
import { TaskRepositoryService } from './task-repository.service';
import { TaskResolverService } from './task-resolver.service';


describe('TaskResolverService', () => {
  let service: TaskResolverService;
  let taskService: TaskRepositoryService;

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
    taskService = TestBed.inject(TaskRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resolve', () => {
    it('should return complete', (done) => {
      const route = new ActivatedRouteSnapshot();
      const routeSpy = jest.spyOn(route.paramMap, 'get').mockReturnValue(null);

      service.resolve(route).pipe(take(1)).subscribe({
        complete: () => {
          expect(routeSpy).toHaveBeenCalled();
          done();
        }
      });
    });

    it('should call router navigate method', (done) => {
      const routerSpy = jest.spyOn(mockRouter, 'navigate');
      const route = new ActivatedRouteSnapshot();
      const routeSpy = jest.spyOn(route.paramMap, 'get').mockReturnValue(mockTasks[0]._id);
      
      service.resolve(route).pipe(take(1)).subscribe({
        complete: () => {
          expect(routeSpy).toHaveBeenCalled();
          expect(routerSpy).toHaveBeenCalledWith(['/tasks/add']);
          done();
        }
      });
    });

    it('should return task', (done) => {
      const route = new ActivatedRouteSnapshot();
      const routeSpy = jest.spyOn(route.paramMap, 'get').mockReturnValue(mockTasks[0]._id);
      taskService.tasks$ = of(mockTasks);

      service.resolve(route).pipe(take(1)).subscribe(result => {
        expect(result).toEqual(mockTasks[0]);
        done();
      });
    });
  });
});
