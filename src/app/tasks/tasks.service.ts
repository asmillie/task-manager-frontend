import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task, ITask } from './task';
import { map, catchError, tap, flatMap, debounceTime } from 'rxjs/operators';
import { ErrorHandlingService } from '../error-handling.service';
import { TaskQueryOptionsService } from './task-query-options.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private API_URL = environment.taskApi.url;
  private GET_TASKS = environment.taskApi.endpoint.tasks.get;
  private ADD_TASK = environment.taskApi.endpoint.tasks.add;

  tasks: BehaviorSubject<Task[]>;
  tasksLoading: BehaviorSubject<boolean>;

  constructor(
    private tqoService: TaskQueryOptionsService,
    private http: HttpClient,
    private errorHandling: ErrorHandlingService) {
      this.initTasksLoading();
      this.initTasks();
  }

  search$(): Observable<Task[]> {
    return of(this.tqoService.taskQueryOptions.getValue()).pipe(
      debounceTime(500),
      flatMap(taskQueryOpts => {
        if (!taskQueryOpts) {
          return null;
        }
        console.log(`TasksService.search$: \n`);
        console.log(JSON.stringify(taskQueryOpts));

        this.tasksLoading.next(true);

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
          tap(tasks => {
            this.tasks.next(tasks);
            this.tasksLoading.next(false);
          }),
          catchError(err => {
            this.tasksLoading.next(false);
            return this.errorHandling.handleHttpError$(err);
          }),
        );
      }),
    );
  }

  add$(task: Task): Observable<Task> {
    this.tasksLoading.next(true);

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
      tap(() => this.tasksLoading.next(false)),
      catchError(err => {
        this.tasksLoading.next(false);
        return this.errorHandling.handleHttpError$(err)
      }),
    );
  }

  private initTasks(): void {
    this.tasks = new BehaviorSubject<Task[]>(null);
  }

  private initTasksLoading(): void {
    this.tasksLoading = new BehaviorSubject<boolean>(false);
  }
}
