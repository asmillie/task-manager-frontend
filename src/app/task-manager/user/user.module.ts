import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



@NgModule({
  declarations: [UserComponent, LoginComponent, SignupComponent],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
