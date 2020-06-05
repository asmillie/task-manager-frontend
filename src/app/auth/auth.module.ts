import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    SharedModule,
  ],
  exports: [LoginComponent]
})
export class AuthModule { }
