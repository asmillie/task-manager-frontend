import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, iif, Observable, of } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import { Task } from './task';
import { TaskRepositoryService } from './task-repository.service';

@Injectable({
  providedIn: 'root'
})
export class TaskResolverService implements Resolve<Task> {

  constructor(private taskService: TaskRepositoryService) { }

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
        const task = tasks.find(t => t.id === id);
        if (!task) {
          return EMPTY;
        }

        return of(task);
      })
    );
  }
}
