import { NgModule } from '@angular/core';
import { TaskManagerComponent } from './task-manager.component';
import { SharedModule } from '../shared/shared.module';
import { TaskManagerRoutingModule } from './task-manager-routing.module';
import { NavComponent } from '../nav/nav.component';
import { UserModule } from '../user/user.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from '../auth/auth.module';
import { NgbCollapseModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddTaskComponent } from '../tasks/add-task/add-task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    NavComponent,
    TaskManagerComponent,
  ],
  imports: [
    SharedModule,
    TaskManagerRoutingModule,
    AuthModule,
    UserModule,
    TasksModule,
    NgbDropdownModule,
    NgbModalModule,
  ],
  entryComponents: [
    AddTaskComponent,
  ],
})
export class TaskManagerModule { }
