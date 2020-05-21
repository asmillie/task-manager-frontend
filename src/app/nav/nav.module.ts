import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { UserModule } from '../task-manager/user/user.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [NavComponent],
  imports: [
    SharedModule,
    UserModule,
  ],
  exports: [NavComponent],
})
export class NavModule { }
