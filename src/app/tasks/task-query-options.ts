import { TaskSortOption } from './task-sort-option';

export interface TaskQueryOptions {
    sort?: TaskSortOption[];
    completed?: boolean;
    startCreatedAt?: Date;
    endCreatedAt?: Date;
    startUpdatedAt?: Date;
    endUpdatedAt?: Date;
}
