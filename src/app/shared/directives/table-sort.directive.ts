import { Directive, Input, TemplateRef, ViewContainerRef, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { TaskSortOption } from '../../tasks/task-sort-option';
import { SORT_DIR } from '../../constants';

@Directive({
    selector: 'th[sortable]',
})
export class TableSortDirective {

    @Input() field: string;
    @Input() direction: string;
    @Output() sort = new EventEmitter<TaskSortOption>();

    @HostListener('click')
    onClick() {
        console.log('TSort Directive: Button Click');
        const newDirection = (this.direction === SORT_DIR.asc) ? SORT_DIR.desc : SORT_DIR.asc;

        const sortOption: TaskSortOption = {
            field: this.field,
            direction: newDirection
        };

        this.direction = newDirection;
        this.sort.emit(sortOption);
    }

    constructor() {
        console.log('New TSort Directive');
    }
}
