import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TasksComponent, TableSortDirective } from './tasks.component';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { AddTaskComponent } from './add-task/add-task.component';
import { SearchTasksComponent } from './search-tasks/search-tasks.component';



@NgModule({
  declarations: [
    TasksComponent,
    TableSortDirective,
    AddTaskComponent,
    SearchTasksComponent
  ],
  imports: [
    SharedModule,
    TasksRoutingModule,
    NgbPaginationModule,
    FormsModule,
  ],
})
export class TasksModule { }
