import { BehaviorSubject } from 'rxjs';
import { TaskQueryOptions } from '../app/tasks/task-query-options';

export const mockTasksService: any = {
    search$: jest.fn(),
    taskQueryOptions: new BehaviorSubject<TaskQueryOptions>(null),
}