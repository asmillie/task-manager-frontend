import { NgModule } from '@angular/core';
import { TaskManagerComponent } from './task-manager.component';
import { SharedModule } from '../shared/shared.module';
import { TaskManagerRoutingModule } from './task-manager-routing.module';
import { NavComponent } from '../nav/nav.component';
import { UserModule } from '../user/user.module';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from '../auth/auth.module';
import { NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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
    NgbCollapseModule,
  ],
})
export class TaskManagerModule { }
