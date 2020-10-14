import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, iif, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { Task } from './task';
import { TaskRepositoryService } from './task-repository.service';

@Injectable({
  providedIn: 'root'
})
export class TaskResolverService implements Resolve<Task> {

  constructor(
    private taskService: TaskRepositoryService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Task> {
    const id = route.paramMap.get('id');
    if (!id) {
      return EMPTY;
    }

    return this.taskService.tasks$.pipe(
      take(1),
      mergeMap(tasks => {
        if (!tasks) {
          this.router.navigate(['/tasks/add']);
          return EMPTY;
        }

        const task = tasks.find(t => t.id === id);
        if (!task) {
          this.router.navigate(['/tasks/add']);
          return EMPTY;
        }

        return of(task);
      })
    );
  }
}
