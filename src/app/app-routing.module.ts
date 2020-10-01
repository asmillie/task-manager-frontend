import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'signup', component: SignupComponent },
  {
    path: 'task-manager',
    loadChildren: () => import('./task-manager/task-manager.module').then(m => m.TaskManagerModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        preloadingStrategy: PreloadAllModules
      }
    ),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
