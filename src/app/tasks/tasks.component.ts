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

    private _nextDirection = '';

    @Input() direction = '';
    @Input() field: string;
    @Output() sort = new EventEmitter<TaskSortOption | string>();
    @HostBinding('class.desc') desc = (this.direction === 'desc');
    @HostBinding('class.asc') asc = (this.direction === 'asc');
    @HostBinding('class.spinner') sorting = false;

    @HostListener('click')
    onClick(): void {
        this.showSorting();
        switch (this.direction) {
          case SORT_DIR.desc:
            this._nextDirection = SORT_DIR.asc;
            break;
          case SORT_DIR.asc:
            this._nextDirection = '';
            break;
          default:
            this._nextDirection = SORT_DIR.desc;
            break;
        }

        const sortOption: TaskSortOption = {
            field: this.field,
            direction: this._nextDirection
        };

        this.sort.emit(sortOption);
    }

    sortCompleted(): void {
      this.updateSort(this._nextDirection);
    }

    sortFailed(): void {
      this.updateSort(this.direction);
    }

    reset(): void {
      this.desc = false;
      this.asc = false;
      this.sorting = false;
      this.direction = '';
      this._nextDirection = '';
    }

    private updateSort(direction: string): void {
      switch (direction) {
        case SORT_DIR.desc:
          this.showDesc();
          break;
        case SORT_DIR.asc:
          this.showAsc();
          break;
        default:
          this.reset();
          break;
      }

      this.direction = direction;
      this._nextDirection = '';
    }

    private showDesc(): void {
      this.asc = false;
      this.desc = true;
      this.sorting = false;
    }

    private showAsc(): void {
      this.asc = true;
      this.desc = false;
      this.sorting = false;
    }

    private showSorting(): void {
      this.asc = false;
      this.desc = false;
      this.sorting = true;
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
    if (tso.direction !== '') {
      this.tqoService.setSortOption(tso);
    } else {
      this.tqoService.resetSearchOpts();
    }

    const headerToSort = this.headers.find(header => header.field === tso.field);

    this.tasksService.search$().pipe(take(1)).subscribe({
      next: () => headerToSort.sortCompleted(),
      error: (err) => {
        headerToSort.sortFailed();
        this.errorMessage = err;
      },
      complete: () => {
        // Clear sorting on other columns
        this.headers.forEach(header => {
          if (header.field !== tso.field && header.direction !== '') {
            header.reset();
          }
        });
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
      next: () => this.isLoading = false,
      error: (err) => this.errorMessage = err
    });

    this.tasks$ = this.tasksService.tasks;
  }

}
