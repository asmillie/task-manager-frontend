import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { SearchTasksComponent } from '../tasks/search-tasks/search-tasks.component';
import { TasksComponent } from '../tasks/tasks.component';
import { UserResolverService } from '../user/user-resolver.service';
import { UserComponent } from '../user/user.component';
import { TaskManagerComponent } from './task-manager.component';

const routes: Routes = [
    {
        path: '',
        component: TaskManagerComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'user',
                component: UserComponent,
                resolve: {
                    user: UserResolverService,
                }
            },
            {
                path: 'tasks',
                component: TasksComponent,
                children: [
                    {
                        path: 'search',
                        component: SearchTasksComponent
                    }
                ]
            },
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ]
})
export class TaskManagerRoutingModule {}
