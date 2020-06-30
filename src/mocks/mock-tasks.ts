import { mockUser } from './mock-users';
import { Task } from '../app/tasks/task';

const mockTask1 = new Task(
    mockUser.id,
    'Incomplete Task #1',
    false,
    new Date('2020-06-24T13:19:26.146Z'),
    undefined,
    'task-id',
);

const mockTask2 = new Task(
    mockUser.id,
    'Incomplete Task #2',
    false,
    new Date('2020-06-22T10:19:26.146Z'),
    undefined,
    'task-id',
);

const mockTask3 = new Task(
    mockUser.id,
    'Incomplete Task #3',
    false,
    new Date('2020-06-10T09:09:26.146Z'),
    undefined,
    'task-id',
);

const mockTask4 = new Task(
    mockUser.id,
    'Completed Task #1',
    true,
    new Date('2020-03-02T03:00:00.146Z'),
    undefined,
    'task-id',
);

const mockTask5 = new Task(
    mockUser.id,
    'Completed Task #2',
    true,
    new Date('2019-01-12T22:10:00.146Z'),
    undefined,
    'task-id',
);

const mockTask6 = new Task(
    mockUser.id,
    'Completed Task #1',
    true,
    new Date('2019-01-01T01:00:00.146Z'),
    undefined,
    'task-id',
);

export const mockTasks = [mockTask1, mockTask2, mockTask3, mockTask4, mockTask5, mockTask6];
export const mockIncompleteTasks = [mockTask1, mockTask2, mockTask3];
export const mockCompletedTasks = [mockTask4, mockTask5, mockTask6];
