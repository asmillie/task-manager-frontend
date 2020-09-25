import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { SearchTasksComponent } from './search-tasks/search-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: TasksComponent
  },
  {
    path: 'search',
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
