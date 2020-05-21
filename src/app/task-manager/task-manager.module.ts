import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagerComponent } from './task-manager.component';
import { UserModule } from './user/user.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TaskManagerComponent],
  imports: [
    SharedModule,
    UserModule,
  ],
  exports: [TaskManagerComponent],
})
export class TaskManagerModule { }
