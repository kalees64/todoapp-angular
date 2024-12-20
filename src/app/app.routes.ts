import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TasksListComponent } from './components/tasks-list/tasks-list.component';
import { TasksViewComponent } from './components/tasks-view/tasks-view.component';
import { TasksEditComponent } from './components/tasks-edit/tasks-edit.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'register',
  //   component: RegisterComponent,
  // },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
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
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),

    canActivate: [authGuard, roleGuard],
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
