import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [UserComponent, SignupComponent],
  imports: [
    SharedModule,
  ],
  exports: [SignupComponent],
})
export class UserModule { }
