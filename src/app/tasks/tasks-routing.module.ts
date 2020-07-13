import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { AuthGuard } from '../auth/auth.guard';
import { UserResolverService } from '../user/user-resolver.service';
import { SearchTasksComponent } from './search-tasks/search-tasks.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: TasksComponent
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    component: SearchTasksComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
