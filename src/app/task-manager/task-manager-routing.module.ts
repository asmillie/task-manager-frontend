import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { TaskComponent } from '../tasks/task/task.component';
import { SearchTasksComponent } from '../tasks/search-tasks/search-tasks.component';
import { TaskResolverService } from '../tasks/task-resolver.service';
import { TasksComponent } from '../tasks/tasks.component';
import { TaskManagerComponent } from './task-manager.component';

const routes: Routes = [
    {
        path: '',
        component: TaskManagerComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: '',
                component: TasksComponent,
                children: [
                    {
                        path: 'search',
                        component: SearchTasksComponent
                    },
                ]
            },
            {
                path: 'add',
                component: TaskComponent,
            },
            {
                path: 'edit/:id',
                component: TaskComponent,
                resolve: {
                    task: TaskResolverService
                }
            }
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
