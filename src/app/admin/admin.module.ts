import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { TasksListAllComponent } from '../components/tasks-list-all/tasks-list-all.component';
import { DataTablesModule } from 'angular-datatables';
import { BadgeComponent } from '../components/ui/badge/badge.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    TasksListAllComponent,
    AdminLayoutComponent,
    AdminSidebarComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DataTablesModule,
    BadgeComponent,
    SweetAlert2Module,
    ReactiveFormsModule,
    QuillModule,
  ],
})
export class AdminModule {}