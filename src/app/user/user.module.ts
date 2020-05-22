import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';



@NgModule({
  declarations: [UserComponent],
  providers: [UserService],
  imports: [
    SharedModule,
  ],
  exports: [
    UserComponent,
  ],
})
export class UserModule { }
