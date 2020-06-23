import { NgModule } from '@angular/core';
import { TasksComponent } from './tasks.component';
import { SharedModule } from '../shared/shared.module';
import { TasksRoutingModule } from './tasks-routing.module';



@NgModule({
  declarations: [TasksComponent],
  imports: [
    SharedModule,
    TasksRoutingModule,
  ]
})
export class TasksModule { }
