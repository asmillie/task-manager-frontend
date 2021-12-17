import { Task } from '../app/tasks/task';

const userId = 'userId';

const mockTask1 = new Task(
    'Incomplete Task #1',
    false,
    userId,
    'task-id',
    new Date('2020-06-24T13:19:26.146Z'),
    undefined,
);

const mockTask2 = new Task(
    'Incomplete Task #2',
    false,
    userId,
    'task-id',
    new Date('2020-06-23T13:19:26.146Z'),
    undefined,
);

const mockTask3 = new Task(
    'Incomplete Task #3',
    false,
    userId,
    'task-id',
    new Date('2020-06-22T13:19:26.146Z'),
    undefined,
);

const mockTask4 = new Task(
    'Completed Task #4',
    true,
    userId,
    'task-id',
    new Date('2020-05-04T13:19:26.146Z'),
    undefined,
);

const mockTask5 = new Task(
    'Completed Task #5',
    true,
    userId,
    'task-id',
    new Date('2019-01-01T13:19:26.146Z'),
    undefined,
);

const mockTask6 = new Task(
    'Completed Task #6',
    true,
    userId,
    'task-id',
    new Date('2019-01-01T03:09:00.000Z'),
    undefined,
);

export const mockTasks = [mockTask1, mockTask2, mockTask3, mockTask4, mockTask5, mockTask6];
export const mockIncompleteTasks = [mockTask1, mockTask2, mockTask3];
export const mockCompletedTasks = [mockTask4, mockTask5, mockTask6];
