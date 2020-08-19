import { Component, OnInit, OnDestroy, ViewChildren, QueryList, Directive, Input,
  Output, EventEmitter, HostListener, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { TasksService } from './tasks.service';
import { Task } from './task';
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TaskSortOption } from './task-sort-option';
import { TaskQueryOptionsService } from './task-query-options.service';
import { SORT_DIR } from '../constants';

@Directive({
    selector: 'th[sortable]',
})
export class TableSortDirective {

    @Input() field: string;
    @Input() direction = '';
    @Output() sort = new EventEmitter<TaskSortOption | string>();
    @HostBinding('class.desc') desc = (this.direction === 'desc');
    @HostBinding('class.asc') asc = (this.direction === 'asc');

    @HostListener('click')
    onClick() {
        const currentDirection = this.direction;
        let newDirection = '';
        this.clearDirection();
        switch (currentDirection) {
          case SORT_DIR.desc:
            newDirection = SORT_DIR.asc;
            this.asc = true;
            break;
          case SORT_DIR.asc:
            newDirection = '';
            break;
          default:
            newDirection = SORT_DIR.desc;
            this.desc = true;
            break;
        }

        const sortOption: TaskSortOption = {
            field: this.field,
            direction: newDirection
        };

        this.direction = newDirection;
        this.sort.emit(sortOption);
    }

    clearDirection(): void {
      this.desc = false;
      this.asc = false;
      this.direction = '';
    }
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {

  @ViewChildren(TableSortDirective) headers: QueryList<TableSortDirective>;

  tasks$: Observable<Task[]>;
  tasksSub: Subscription;
  isLoading: boolean;
  tasksLoading: Observable<boolean>;
  errorMessage = '';

  constructor(
    private tqoService: TaskQueryOptionsService,
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
    // Clear sorting on other columns
    this.headers.forEach(header => {
      if (header.field !== tso.field && header.direction !== '') {
        header.clearDirection();
      }
    });

    if (tso.direction !== '') {
      this.tqoService.setSortOption(tso);
    } else {
      this.tqoService.resetSearchOpts();
    }

    this.tasksService.search$().pipe(take(1)).subscribe({
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  onDismissAlert(): void {
    this.errorMessage = '';
  }

  private initTasks(): void {
    this.isLoading = true;

    this.tasksLoading = this.tasksService.tasksLoading;

    this.tasksService.search$().pipe(
      take(1),
    ).subscribe({
      error: (err) => this.errorMessage = err
    });

    this.tasks$ = this.tasksService.tasks;
  }

}
