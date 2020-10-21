import { of } from 'rxjs';
import { SORT_DIR, SORT_FIELDS } from '../app/constants';
import { TaskQueryOptions } from '../app/tasks/task-query-options';
import { mockTasks } from './mock-tasks';

const default_tqo: TaskQueryOptions = {
    sort: [
        { field: SORT_FIELDS.completed, direction: SORT_DIR.asc },
        { field: SORT_FIELDS.updatedAt, direction: SORT_DIR.desc },
        { field: SORT_FIELDS.createdAt, direction: SORT_DIR.asc },
      ]
}

export const mockTaskRepositoryService = {
    getNextPage$: jest.fn(),
    search$: jest.fn().mockReturnValue(of(true)),
    add$: jest.fn(),
    edit$: jest.fn(),
    refresh: jest.fn(),
    resetSearchOpts: jest.fn(),
    setSortOption: jest.fn(),
    setQueryOption: jest.fn(),
    taskQueryOptions$: of(default_tqo),
    tasks$: of(mockTasks),
    totalResults$: of(80),
    loading$: of(true),
};
