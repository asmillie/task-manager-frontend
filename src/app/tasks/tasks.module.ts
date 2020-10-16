import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksComponent, TableSortDirective } from './tasks.component';
import { SharedModule } from '../shared/shared.module';
import { TaskComponent } from './task/task.component';
import { SearchTasksComponent } from './search-tasks/search-tasks.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TasksComponent,
    TableSortDirective,
    TaskComponent,
    SearchTasksComponent
  ],
  imports: [
    SharedModule,
    NgbPaginationModule,
    FormsModule,
    NgbCollapseModule,
    NgbModalModule,
    RouterModule,
  ],
})
export class TasksModule { }
