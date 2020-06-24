import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from, pipe, iif, defer, throwError } from 'rxjs';
import { Task, ITask } from './task';
import { TaskQueryOptions } from './task-query-options';
import { validate } from 'class-validator';
import { switchMap, map, flatMap, catchError } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.taskApi.url;
  private TASKS_ENDPOINT = environment.taskApi.endpoint.tasks;

  tasksSubject: BehaviorSubject<Task>;

  constructor(
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {
    this.initTasks();
  }

  getAll$(completed?: boolean, tqo?: TaskQueryOptions): Observable<Task[]> {
    // If TQO is set then validate
    // :: If returns null then continue
    // :: If returns ValidationErrors then throw error
    // If TQO is not set then continue
    // If no errors then call http method
    return defer(() => {
      if (tqo) {
        return this.validateTaskQueryOptions$(tqo);
      }

      return of(null);
    }).pipe(
      catchError(this.errorHandling.handleValidationError$),
      flatMap(() => {
        let url = this.API_URL + this.TASKS_ENDPOINT;
        if (completed) {
          url += `?completed=${completed}`;
        }

        return this.http.post<ITask[]>(url, tqo).pipe(
          catchError(this.errorHandling.handleHttpError$),
          map((response: ITask[]) => {
            console.log(response);
            if (!response) {
              return null;
            }

            const tasks: Task[] = [];
            response.forEach(iTask => {
              const task = new Task(iTask.owner, iTask.description, iTask.completed, iTask.createdAt, iTask.updatedAt);
              tasks.push(task);
            });

            return tasks;
          }),
        );
      }),
    );
  }

  private initTasks(): void {
    this.tasksSubject = new BehaviorSubject<Task>(null);
  }

  private validateTaskQueryOptions$(tqo: TaskQueryOptions): Observable<never | null> {
    return from(validate(tqo)).pipe(
        switchMap(errors => {
          if (errors.length > 0) {
            throwError(errors);
          }

          return of(null);
        })
      );
  }
}
