import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { UserRoutingModule } from './user-routing.module';



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
export class UserModule {}
