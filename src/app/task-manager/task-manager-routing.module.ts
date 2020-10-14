import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AddTaskComponent } from '../tasks/add-task/add-task.component';
import { SearchTasksComponent } from '../tasks/search-tasks/search-tasks.component';
import { TaskResolverService } from '../tasks/task-resolver.service';
import { TasksComponent } from '../tasks/tasks.component';
import { UserResolverService } from '../user/user-resolver.service';
import { UserComponent } from '../user/user.component';
import { TaskManagerComponent } from './task-manager.component';

const routes: Routes = [
    {
        path: '',
        component: TaskManagerComponent,
        data: { animation: 'TaskManagerPage' },
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'user',
                component: UserComponent,
                data: { animation: 'UserEditPage' },
                resolve: {
                    user: UserResolverService,
                }
            },
            {
                path: '',
                component: TasksComponent,
                data: { animation: 'TasksPage' },
                children: [
                    {
                        path: 'search',
                        component: SearchTasksComponent
                    },
                ]
            },
            {
                path: 'add',
                component: AddTaskComponent,
                data: { animation: 'AddTaskPage' },
            },
            {
                path: 'edit/:id',
                component: AddTaskComponent,
                data: { animation: 'EditTaskPage' },
                resolve: {
                    TaskResolverService
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
