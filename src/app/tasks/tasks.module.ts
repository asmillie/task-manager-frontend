import { NgModule } from '@angular/core';
import { TasksComponent } from './tasks.component';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';
import { AddTaskComponent } from './add-task/add-task.component';



@NgModule({
  declarations: [TasksComponent, AddTaskComponent],
  imports: [
    SharedModule,
    TasksRoutingModule,
  ]
})
export class TasksModule { }
