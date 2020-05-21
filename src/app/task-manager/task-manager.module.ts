import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagerComponent } from './task-manager.component';



@NgModule({
  declarations: [TaskManagerComponent],
  imports: [
    CommonModule
  ],
  exports: [TaskManagerComponent],
})
export class TaskManagerModule { }
