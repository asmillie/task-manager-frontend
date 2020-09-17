export const mockTaskRepositoryService = {
    getNextPage$: jest.fn(),
    search$: jest.fn(),
    add$: jest.fn(),
    refresh: jest.fn(),
    resetSearchOpts: jest.fn(),
    setSortOption: jest.fn(),
    setQueryOption: jest.fn(),
    taskQueryOptions$: jest.fn(),
};
