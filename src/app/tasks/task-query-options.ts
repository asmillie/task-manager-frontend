export interface TaskQueryOptions {
    limit?: number;
    skip?: number;
    sort?: {
        field: string;
        direction: string;
    };
}

export const SORT_FIELDS = ['completed', 'createdAt', 'updatedAt', 'description'];
export const SORT_DIR = ['asc', 'desc'];
