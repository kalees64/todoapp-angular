import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksListAllComponent } from '../components/tasks-list-all/tasks-list-all.component';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'tasks',
        component: TasksListAllComponent,
        canActivate: [authGuard, roleGuard],
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
