import { Directive, Input, TemplateRef, ViewContainerRef, Output, EventEmitter, HostListener } from '@angular/core';
import { TaskSortOption } from '../../tasks/task-sort-option';

@Directive({
    selector: 'th[sortable]',
})
export class TableSortDirective {

    @Input() field: string;
    @Input() direction: string;
    @Output() sort = new EventEmitter<TaskSortOption>();

    @HostListener('click')
    onClick() {
        // Switch sort direction and output new sort event
        const sortOption: TaskSortOption = {
            field: this.field,
            direction: (this.direction === 'asc') ? 'desc' : 'asc',
        };

        this.sort.emit(sortOption);
    }
}
