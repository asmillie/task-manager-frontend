import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from, defer, throwError } from 'rxjs';
import { Task, ITask } from './task';
import { TaskQueryOptions, SORT_DIR, SORT_FIELDS, TaskSearch } from './task-query-options';
import { map, catchError, tap, flatMap } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';

const DEFAULT_TQO: TaskQueryOptions = {
  limit: 50,
  sort: [
    { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
    { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
  ]
};

const DEFAULT_SEARCH: TaskSearch = {
  tqo: DEFAULT_TQO,
};

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.taskApi.url;
  private GET_TASKS = environment.taskApi.endpoint.tasks.get;
  private ADD_TASK = environment.taskApi.endpoint.tasks.add;

  tasks: BehaviorSubject<Task[]>;
  taskSearchOptions: BehaviorSubject<TaskSearch>;

  constructor(
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {
    this.initSearchOpts();
    this.initTasks();
  }

  search$(): Observable<Task[]> {
    return this.taskSearchOptions.pipe(
      flatMap(taskSearchOpts => {
        if (!taskSearchOpts) {
          return null;
        }

        let url = this.API_URL + this.GET_TASKS;
        if (taskSearchOpts.completed) {
          url += `?completed=${taskSearchOpts.completed}`;
        }

        return this.http.post<ITask[]>(url, taskSearchOpts.tqo).pipe(
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
    if (!this.taskSearchOptions) {
      this.initSearchOpts();
      return;
    }
    this.taskSearchOptions.next(DEFAULT_SEARCH);
  }

  private initTasks(): void {
    this.tasks = new BehaviorSubject<Task[]>(null);
  }

  private initSearchOpts(): void {
    this.taskSearchOptions = new BehaviorSubject<TaskSearch>(DEFAULT_SEARCH);
  }
}
