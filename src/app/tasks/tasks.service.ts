import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, ITask } from './task';
import { TaskQueryOptions } from './task-query-options';
import { map, catchError, tap, flatMap } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';
import { SORT_FIELDS, SORT_DIR } from '../constants';

const DEFAULT_TQO: TaskQueryOptions = {
  limit: 50,
  sort: [
    { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
    { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.taskApi.url;
  private GET_TASKS = environment.taskApi.endpoint.tasks.get;
  private ADD_TASK = environment.taskApi.endpoint.tasks.add;

  tasks: BehaviorSubject<Task[]>;
  taskQueryOptions: BehaviorSubject<TaskQueryOptions>;

  constructor(
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {
    this.initSearchOpts();
    this.initTasks();
  }

  search$(): Observable<Task[]> {
    return this.taskQueryOptions.pipe(
      flatMap(taskQueryOpts => {
        if (!taskQueryOpts) {
          return null;
        }

        let url = this.API_URL + this.GET_TASKS;
        if (taskQueryOpts.completed) {
          url += `?completed=${taskQueryOpts.completed}`;
        }

        return this.http.post<ITask[]>(url, taskQueryOpts).pipe(
          map((response: ITask[]) => {
            if (!response) {
              return null;
            }

            const tasks: Task[] = [];
            response.forEach(iTask => {
              const createdAt = new Date(iTask.createdAt);
              let updatedAt;
              if (iTask.updatedAt) {
                updatedAt = new Date(iTask.updatedAt);
              }
              const task = new Task(iTask.description, iTask.completed, iTask.owner, iTask._id, createdAt, updatedAt);
              tasks.push(task);
            });

            return tasks;
          }),
          tap(tasks => this.tasks.next(tasks)),
          catchError(err => this.errorHandling.handleHttpError$(err)),
        );
      }),
    );
  }

  add$(task: Task): Observable<Task> {
    return this.http.post<ITask>(
      this.API_URL + this.ADD_TASK,
      {
        description: task.description,
        completed: task.completed
      }
    ).pipe(
      map((res: ITask) => {
        if (!res) {
          return null;
        }

        return new Task(res.description, res.completed, res.owner, res._id, res.createdAt, res.updatedAt);
      }),
      catchError(err => this.errorHandling.handleHttpError$(err)),
    );
  }

  resetSearchOpts(): void {
    if (!this.taskQueryOptions) {
      this.initSearchOpts();
      return;
    }
    this.taskQueryOptions.next(DEFAULT_TQO);
  }

  private initTasks(): void {
    this.tasks = new BehaviorSubject<Task[]>(null);
  }

  private initSearchOpts(): void {
    this.taskQueryOptions = new BehaviorSubject<TaskQueryOptions>(DEFAULT_TQO);
  }
}
