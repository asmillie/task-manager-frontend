import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task } from './task';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TableSortDirective } from '../shared/directives/table-sort.directive';
import { TaskSortOption } from './task-sort-option';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {

  @ViewChildren(TableSortDirective) headers: QueryList<TableSortDirective>;

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

  onSort(tso: TaskSortOption): void {
    console.log('Sort called');
    // Clear sorting on other columns
    this.headers.forEach(header => {
      if (header.field !== tso.field) {
        header.direction = '';
      }
    });

    // Sort data by selected column
    // TODO: Sorting and pagination supported in tasks service or an intermediary service
  }

  private initTasks(): void {
    this.isLoading = true;

    this.tasksService.search$().pipe(
      take(1),
    ).subscribe({
      error: (err) => this.errorMessage = err
    });

    this.tasksSub = this.tasksService.tasks.subscribe(tasks => {
      this.tasks = tasks;
      this.isLoading = false;
    }, error => {
      this.errorMessage = error;
      this.isLoading = false;
    });
  }

}
