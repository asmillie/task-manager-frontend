import { NgModule } from '@angular/core';
import { TaskManagerComponent } from './task-manager.component';
import { SharedModule } from '../shared/shared.module';
import { TaskManagerRoutingModule } from './task-manager-routing.module';
import { NavComponent } from '../nav/nav.component';
import { TasksModule } from '../tasks/tasks.module';
import { AuthModule } from '@auth0/auth0-angular';
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
    TasksModule,
    NgbDropdownModule,
    NgbCollapseModule,
  ],
})
export class TaskManagerModule { }
