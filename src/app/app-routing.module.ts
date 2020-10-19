import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'tasks',
    loadChildren: () => import('./task-manager/task-manager.module').then(m => m.TaskManagerModule),
  },
  { path: '', component: HomeComponent, data: { animation: 'FadeInPage' } },
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
