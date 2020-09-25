import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserResolverService } from './user-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: {
      user: UserResolverService,
    }
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class UserRoutingModule { }
