import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, ITask } from './task';
import { map, catchError, flatMap, debounceTime, take } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';
import { TaskQueryOptions } from './task-query-options';
import { TaskSortOption } from './task-sort-option';
import { SORT_FIELDS, SORT_DIR } from '../constants';

export interface TaskQuery extends TaskQueryOptions {
  readonly limit: number;
  readonly page: number;
}

export interface TaskPaginationData {
    readonly totalResults: number;
    readonly totalPages: number;
    readonly currentPage: number;
    readonly pageSize: number;
    readonly tasks: ITask[];
}

const DEFAULT_TASK_QUERY: TaskQuery = {
  limit: 100,
  page: 1,
};

const DEFAULT_TQO: TaskQueryOptions = {
  sort: [
    { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
    { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
    { field: SORT_FIELDS.createdAt, direction: SORT_DIR.asc },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryService {

  // API ENDPOINTS
  private API_URL = environment.taskApi.url;
  private GET_TASKS = environment.taskApi.endpoint.tasks.get;
  private ADD_TASK = environment.taskApi.endpoint.tasks.add;
  private EDIT_TASK = environment.taskApi.endpoint.tasks.patch;
  private DELETE_TASK = environment.taskApi.endpoint.tasks.delete;

  private _loading$ = new BehaviorSubject<boolean>(false);
  private _tasks$ = new BehaviorSubject<Task[] | null>(null);
  private _totalResults$ = new BehaviorSubject<number>(0);
  private _taskQueryOptions$ = new BehaviorSubject<TaskQueryOptions>(DEFAULT_TQO);

  private _limit = 100;
  private _currentPage = 1;
  private _totalPages = 1;

  public loading$ = this._loading$.asObservable();
  public tasks$ = this._tasks$.asObservable();
  public totalResults$ = this._totalResults$.asObservable();
  public taskQueryOptions$ = this._taskQueryOptions$.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {}

  getNextPage$(): Observable<boolean> {
    this._loading$.next(true);

    const nextPage = this._currentPage + 1;

    if (nextPage > this._totalPages) {
      this._loading$.next(false);
      return of(false);
    }

    this._currentPage = nextPage;
    return this.search$(false).pipe(
      take(1),
    );
  }

  search$(newSearch: boolean = true): Observable<boolean> {
    return of(this._taskQueryOptions$.getValue()).pipe(
      debounceTime(500),
      flatMap(taskQueryOpts => {
        if (!taskQueryOpts) {
          return null;
        }
 
        this._loading$.next(true);

        const taskQuery: TaskQuery = {
          limit: this._limit,
          page: this._currentPage,
          ...taskQueryOpts,
        };

        const url = this.API_URL + this.GET_TASKS;

        return this.http.post<TaskPaginationData>(url, taskQuery).pipe(
          map((response: TaskPaginationData) => {
            if (!response) {
              return false;
            }
 
            let tasks: Task[] = [];
            if (!newSearch) {
              // Add to current tasks
              const currentTasks = this._tasks$.getValue();
              if (currentTasks && currentTasks.length > 0) {
                tasks = currentTasks;
              }
            }

            response.tasks.forEach(iTask => {
              const createdAt = new Date(iTask.createdAt);
              let updatedAt;
              if (iTask.updatedAt) {
                updatedAt = new Date(iTask.updatedAt);
              }
              const task = new Task(iTask.description, iTask.completed, iTask.owner, iTask._id, createdAt, updatedAt);
              tasks.push(task);
            });

            this._tasks$.next(tasks);
            this._totalResults$.next(response.totalResults);
            this._totalPages = response.totalPages;
            this._currentPage = response.currentPage;

            this._loading$.next(false);

            return true;
          }),
          catchError(err => {
            this._loading$.next(false);
            return this.errorHandling.handleHttpError$(err);
          }),
        );
      }),
    );
  }

  add$(task: Task): Observable<Task> {
    this._loading$.next(true);

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

        const newTask = new Task(res.description, res.completed, res.owner, res._id, res.createdAt, res.updatedAt);
        const tasks: Task[] = this._tasks$.getValue() ? this._tasks$.getValue() : [];
        tasks.push(newTask);

        this._tasks$.next(tasks);

        this._loading$.next(false);

        return newTask;
      }),
      catchError(err => {
        this._loading$.next(false);
        return this.errorHandling.handleHttpError$(err);
      }),
    );
  }

  edit$(task: Task): Observable<Task> {
    this._loading$.next(true);

    return this.http.patch<ITask>(
      `${this.API_URL}${this.EDIT_TASK}/${task.id}`,
      {
        description: task.description,
        completed: task.completed
      }
    ).pipe(
      map((res: ITask) => {
        if (!res) {
          return null;
        }

        const newTask = new Task(res.description, res.completed, res.owner, res._id, res.createdAt, res.updatedAt);
        const tasks: Task[] = this._tasks$.getValue() ? this._tasks$.getValue() : [];

        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex === -1) {
          tasks.push(newTask);
        } else {
          tasks.splice(taskIndex, 1, newTask);
        }

        this._tasks$.next(tasks);
        this._loading$.next(false);

        return newTask;
      }),
      catchError(err => {
        this._loading$.next(false);
        return this.errorHandling.handleHttpError$(err);
      }),
    );
  }

  delete$(task: Task): Observable<boolean> {
    this._loading$.next(true);

    return this.http.delete<ITask>(
      `${this.API_URL}${this.DELETE_TASK}/${task.id}`
    ).pipe(
      map((res: ITask) => {
        if (!res) {
          return false;
        }

        const tasks: Task[] = this._tasks$.getValue() ? this._tasks$.getValue() : [];

        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          tasks.splice(taskIndex, 1);
        }

        this._tasks$.next(tasks);
        this._loading$.next(false);

        return true;
      }),
      catchError(err => {
        this._loading$.next(false);
        return this.errorHandling.handleHttpError$(err);
      }),
    );
  }

  refresh(): void {
    this._tasks$.next(this._tasks$.getValue());
  }

  resetSearchOpts(): void {
    const tqo: TaskQueryOptions = {
      ...DEFAULT_TQO
    };

    this._taskQueryOptions$.next(tqo);
  }

  setSortOption(tso: TaskSortOption): void {
    const tqo: TaskQueryOptions = {
      ...this._taskQueryOptions$.getValue(),
      sort: [
        tso
      ]
    };

    this._taskQueryOptions$.next(tqo);
  }

  setQueryOption(tqo: TaskQueryOptions) {
    const taskQueryOpts: TaskQueryOptions = {
      ...this._taskQueryOptions$.getValue(),
      ...tqo,
    };

    this._taskQueryOptions$.next(taskQueryOpts);
  }
}
