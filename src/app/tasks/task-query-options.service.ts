import { Injectable } from '@angular/core';
import { TaskSortOption } from './task-sort-option';
import { TaskQueryOptions } from './task-query-options';
import { SORT_FIELDS, SORT_DIR } from '../constants';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_TQO: TaskQueryOptions = {
  limit: 50,
  sort: [
    { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
    { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
  ]
};

@Injectable({
  providedIn: 'root'
})
export class TaskQueryOptionsService {

  taskQueryOptions: BehaviorSubject<TaskQueryOptions>;

  constructor() {
    this.initSearchOpts();
   }

  resetSearchOpts(): void {
    if (!this.taskQueryOptions) {
      this.initSearchOpts();
      return;
    }
    this.taskQueryOptions.next(DEFAULT_TQO);
  }

  setSortOptions(tso: TaskSortOption[]): void {
    const tqo: TaskQueryOptions = {
      ...this.taskQueryOptions.getValue(),
      sort: tso
    };

    this.taskQueryOptions.next(tqo);
  }

  setPaginationOptions(limit: number, page: number) {
    if (limit < 25 || limit > 100 || page < 0) {
      return;
    }

    const skip = (page > 1) ? page - 1 : 0;
    const tqo: TaskQueryOptions = {
      ...this.taskQueryOptions.getValue(),
      limit,
      skip
    };

    this.taskQueryOptions.next(tqo);
  }

  private initSearchOpts(): void {
    this.taskQueryOptions = new BehaviorSubject<TaskQueryOptions>(DEFAULT_TQO);
  }
}
