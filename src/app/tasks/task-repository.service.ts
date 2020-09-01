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

const DEFAULT_TQO: TaskQueryOptions = {
  limit: 100,
  page: 1,
  sort: [
    { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
    { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
    { field: SORT_FIELDS.createdAt, direction: SORT_DIR.asc },
  ]
};

interface TaskPaginationData {
    readonly totalResults: number;
    readonly totalPages: number;
    readonly currentPage: number;
    readonly pageSize: number;
    readonly tasks: ITask[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskRepositoryService {

  // API ENDPOINTS
  private API_URL = environment.taskApi.url;
  private GET_TASKS = environment.taskApi.endpoint.tasks.get;
  private ADD_TASK = environment.taskApi.endpoint.tasks.add;

  private _loading$: BehaviorSubject<boolean>;
  private _tasks$: BehaviorSubject<Task[]>;
  private _totalResults$: BehaviorSubject<number>;
  private _taskQueryOptions$: BehaviorSubject<TaskQueryOptions>;

  private _currentPage = 1;
  private _totalPages = 1;

  public loading$ = this._loading$.asObservable();
  public tasks$ = this._tasks$.asObservable();
  public totalResults$ = this._totalResults$.asObservable();
  public taskQueryOptions$ = this._totalResults$.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {
      this.initSubjects();
  }

  getNextPage$(): Observable<boolean> {
    this._loading$.next(true);

    const currentTQO = this._taskQueryOptions$.getValue();
    const nextPage = this._currentPage + 1;

    if (nextPage > this._totalPages) {
      this._loading$.next(false);
      return of(false);
    }

    const tqo: TaskQueryOptions = {
      ...currentTQO,
      page: nextPage,
    };

    this._taskQueryOptions$.next(tqo);

    return this.search$().pipe(
      take(1),
    );
  }

  search$(): Observable<boolean> {
    return of(this._taskQueryOptions$.getValue()).pipe(
      debounceTime(500),
      flatMap(taskQueryOpts => {
        if (!taskQueryOpts) {
          return null;
        }

        this._loading$.next(true);

        let url = this.API_URL + this.GET_TASKS;
        if (taskQueryOpts.completed) {
          url += `?completed=${taskQueryOpts.completed}`;
        }

        return this.http.post<TaskPaginationData>(url, taskQueryOpts).pipe(
          map((response: TaskPaginationData) => {
            if (!response) {
              return null;
            }

            const tasks: Task[] = [];
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
            this._totalPages = response.totalPages;

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

        this._loading$.next(false);

        return new Task(res.description, res.completed, res.owner, res._id, res.createdAt, res.updatedAt);
      }),
      catchError(err => {
        this._loading$.next(false);
        return this.errorHandling.handleHttpError$(err)
      }),
    );
  }

  resetSearchOpts(): void {
    const tqo: TaskQueryOptions = {
      ...this._taskQueryOptions$.getValue(),
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

  private initSubjects(): void {
    this._tasks$ = new BehaviorSubject<Task[]>(null);
    this._loading$ = new BehaviorSubject<boolean>(false);
    this._totalResults$ = new BehaviorSubject<number>(0);
    this._taskQueryOptions$ = new BehaviorSubject<TaskQueryOptions>(DEFAULT_TQO);
  }
}
