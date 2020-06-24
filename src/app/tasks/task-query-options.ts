import { IsOptional, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskSortOption } from './task-sort-option';

export class TaskQueryOptions {
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsInt()
    skip?: number;

    @IsOptional()
    @Type(() => TaskSortOption)
    @ValidateNested()
    sort?: TaskSortOption[];
}