import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksCreateComponent } from './components/tasks-create/tasks-create.component';
import { TasksViewComponent } from './components/tasks-view/tasks-view.component';
import { TasksEditComponent } from './components/tasks-edit/tasks-edit.component';
import { TasksListAllComponent } from './components/tasks-list-all/tasks-list-all.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'tasks',
    children: [
      {
        path: '',
        component: TasksListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'all',
        component: TasksListAllComponent,
        canActivate: [authGuard, roleGuard],
      },
      {
        path: 'create',
        component: TasksCreateComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view/:id',
        component: TasksViewComponent,
        canActivate: [authGuard],
      },
      {
        path: 'edit/:id',
        component: TasksEditComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
