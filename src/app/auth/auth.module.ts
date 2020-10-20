import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuthComponent, LoginComponent],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [LoginComponent]
})
export class AuthModule { }
