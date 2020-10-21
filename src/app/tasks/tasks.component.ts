import { Component, OnInit, OnDestroy, ViewChildren, QueryList, Directive, Input,
  Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { Task } from './task';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { take, map, first } from 'rxjs/operators';
import { TaskSortOption } from './task-sort-option';
import { SORT_DIR } from '../constants';
import { TaskRepositoryService } from './task-repository.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { collapseExpandAnimation, tableRowAnimation } from '../animations';

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
  styleUrls: ['./tasks.component.scss'],
  animations: [
    tableRowAnimation,
    collapseExpandAnimation,
  ]
})
export class TasksComponent implements OnInit, OnDestroy {

  @ViewChildren(TableSortDirective) headers: QueryList<TableSortDirective>;

  tasks$ = new BehaviorSubject<Task[]>(null);

  subscriptions: Subscription;
  isLoading: boolean;
  tasksLoading: Observable<boolean>;
  errorMessage = '';
  page = 1;
  pageSize = 10;
  totalPages = 1;
  totalTaskResults = 0;
  collectionSize = 0;
  collapseSearch = true;
  animateRows = 0;
  firstLoad = true;

  modalRef: NgbModalRef;
  taskToDelete: Task = null;
  deleteError = '';

  constructor(
    private taskRepo: TaskRepositoryService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.initObservables();
    this.animateRows++;
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }

  onSort(tso: TaskSortOption): void {
    if (tso.direction !== '') {
      this.taskRepo.setSortOption(tso);
    } else {
      this.taskRepo.resetSearchOpts();
    }

    const headerToSort = this.headers.find(header => header.field === tso.field);

    this.taskRepo.search$().pipe(take(1)).subscribe({
      next: () => headerToSort.sortCompleted(),
      error: (err) => {
        headerToSort.sortFailed();
        this.errorMessage = err;
      },
      complete: () => {
        this.clearUnselectedHeaders(tso);
      }
    });
  }

  onDismissAlert(): void {
    this.errorMessage = '';
  }

  onPageChange(): void {
    this.taskRepo.refresh();
  }

  onPageSizeChange(): void {
    this.taskRepo.refresh();
  }

  onDelete(deleteModalContent, task: Task): void {
    this.taskToDelete = task;
    this.deleteError = '';
    this.modalRef = this.modalService.open(deleteModalContent);
  }

  deleteTask(): void {
    if (!this.taskToDelete) {
      return;
    }

    this.taskRepo.delete$(this.taskToDelete).pipe(take(1))
      .subscribe(success => {
        this.taskToDelete = null;
        this.deleteError = '';
        this.modalRef.close();
      }, (err) => {
        this.deleteError = 'An error occurred, please try again.';
      });
  }

  // loadMoreResults(): void {
  //   // Any error will be returned by tasks observable
  //   this.taskRepo.getNextPage$().pipe(
  //     take(1),
  //   ).subscribe({
  //     complete: () => {
  //       this.isLoading = false;
  //     }
  //   });
  // }

  toggleSearch(): void {
    this.collapseSearch = !this.collapseSearch;
  }

  private initObservables(): void {
    this.tasksLoading = this.taskRepo.loading$;
    this.subscriptions =  new Subscription();

    const taskSub = this.taskRepo.tasks$.pipe(
      map(tasks => {
        if (!tasks) {
          return {
            count: 0,
            page: [],
          };
        }

        const pageIndex = (this.page - 1) * this.pageSize;
        return {
          count: tasks.length,
          page: tasks.slice(pageIndex, pageIndex + this.pageSize)
        };
      }),
    ).subscribe(tasks => {
      this.collectionSize = tasks.count;
      this.tasks$.next(tasks.page);
      this.animateRows++;
    });
    this.subscriptions.add(taskSub);

    const resultSub = this.taskRepo.totalResults$.subscribe(total => {
      this.totalTaskResults = total;
    });
    this.subscriptions.add(resultSub);

    this.taskRepo.taskQueryOptions$.pipe(take(1)).subscribe(tqo => {
      if (tqo.startCreatedAt || tqo.startUpdatedAt || tqo.endCreatedAt || tqo.endUpdatedAt || tqo.completed !== undefined) {
        this.toggleSearch();
      }
    });

    this.taskRepo.search$().pipe(
      take(1),
    ).subscribe({
      error: (err) => this.errorMessage = err
    });
  }

  private clearUnselectedHeaders(tso: TaskSortOption): void {
    if (!tso) {
      return;
    }

    this.headers.forEach(header => {
      if (header.field !== tso.field && header.direction !== '') {
        header.reset();
      }
    });
  }
}
