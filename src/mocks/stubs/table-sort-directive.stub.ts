import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SORT_DIR, SORT_FIELDS } from '../../app/constants';
import { TaskSortOption } from '../../app/tasks/task-sort-option';
import { TableSortDirective } from '../../app/tasks/tasks.component';

@Directive({
    selector: 'th[sortable]',
})
export class TableSortDirectiveStub {

    @Input() direction = '';
    @Input() field = '';
    @Output() sort = new EventEmitter<TaskSortOption>();

    @HostListener('click')
    onClick() {
        const sortOption: TaskSortOption = {
            field: SORT_FIELDS.createdAt,
            direction: SORT_DIR.asc,
        };

        this.sort.emit(sortOption);
    }

    sortCompleted() {}
    sortFailed() {}
    reset() {}
}
