import { TaskSortOption } from './task-sort-option';

export interface TaskQueryOptions {
    limit: number;
    page: number;
    sort?: TaskSortOption[];
    completed?: boolean;
    startCreatedAt?: Date;
    endCreatedAt?: Date;
    startUpdatedAt?: Date;
    endUpdatedAt?: Date;
}
