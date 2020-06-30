import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from, defer, throwError } from 'rxjs';
import { Task, ITask } from './task';
import { TaskQueryOptions } from './task-query-options';
import { map, catchError } from 'rxjs/operators';
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
    let url = this.API_URL + this.TASKS_ENDPOINT;
    if (completed) {
      url += `?completed=${completed}`;
    }

    return this.http.post<ITask[]>(url, tqo).pipe(
      map((response: ITask[]) => {
        if (!response) {
          return null;
        }

        const tasks: Task[] = [];
        response.forEach(iTask => {
          const task = new Task(iTask.owner, iTask.description, iTask.completed, iTask.createdAt, iTask.updatedAt, iTask._id);
          tasks.push(task);
        });

        return tasks;
      }),
      catchError(err => this.errorHandling.handleHttpError$(err)),
    );
  }

  private initTasks(): void {
    this.tasksSubject = new BehaviorSubject<Task>(null);
  }
}
