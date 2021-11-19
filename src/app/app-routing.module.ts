import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { DemoComponent } from './demo/demo.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  // {
  //   path: 'login', component: LoginComponent
  // },
  // {
  //   path: 'signup', component: SignupComponent
  // },
  // {
  //   path: 'demo', component: DemoComponent
  // },
  {
    path: 'tasks',
    loadChildren: () => import('./task-manager/task-manager.module').then(m => m.TaskManagerModule),
  },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: '', component: HomeComponent
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
