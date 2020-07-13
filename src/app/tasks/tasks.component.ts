import { Component, OnInit, OnDestroy } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task } from './task';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {

  tasks: Task[];
  tasksSub: Subscription;
  isLoading: boolean;
  errorMessage = '';

  constructor(
    private tasksService: TasksService,
  ) { }

  ngOnInit(): void {
    this.initTasks();
  }

  ngOnDestroy(): void {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
  }

  private initTasks(): void {
    this.isLoading = true;

    this.tasksService.search$().pipe(
      take(1),
    ).subscribe({
      error: (err) => this.errorMessage = err
    });

    this.tasksSub = this.tasksService.tasks.subscribe(tasks => {
      console.log(tasks);
      this.tasks = tasks;
      this.isLoading = false;
    }, error => {
      this.errorMessage = error;
      this.isLoading = false;
    });
  }

}
