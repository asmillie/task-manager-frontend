export interface TaskQueryOptions {
    limit?: number;
    skip?: number;
    sort?: {
        field: string;
        direction: string;
    }[];
}

export interface TaskSearch {
    completed?: boolean;
    tqo?: TaskQueryOptions;
}

export const SORT_FIELDS = {
    completed: 'completed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    description: 'description'
};

export const SORT_DIR = {
    asc: 'asc',
    desc: 'desc',
};
