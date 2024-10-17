import { Sweetalert2ModuleConfig } from './../../../../node_modules/@sweetalert2/ngx-sweetalert2/lib/sweetalert2.module.d';
import { Component } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../sevices/user.service';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { BadgeComponent } from '../ui/badge/badge.component';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataTablesModule,
    BadgeComponent,
    NgIf,
    SweetAlert2Module,
  ],
  templateUrl: './tasks-list.component.html',
  styles: ``,
})
export class TasksListComponent {
  constructor(
    private taskService: TaskService,
    private toast: ToastrService,
    private userService: UserService
  ) {}

  tasks!: I_TASK[];

  dtOptions: Config = {};

  fetchTasks() {
    const userId = this.userService.getUserIdFromLocalStorage();
    this.taskService.getTasks().subscribe(
      (res: any) => {
        this.tasks = res.data.filter(
          (val: I_TASK) => val.created_by === userId
        );
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  completeTask(id: number, task: I_TASK) {
    const completeTask = {
      name: task.name,
      created_by: task.created_by,
      status: 'COMPLETED',
    };
    this.taskService.updateTask(id, completeTask).subscribe(
      (res: any) => {
        console.log(res.data);
        this.toast.success('Task Completed');
        this.ngOnInit();
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
  }

  deleteTask(id: number, task: I_TASK) {
    console.log(id);
    Swal.fire({
      title: `Do you want to delete ${task.name}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe(
          (res: any) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            this.ngOnInit();
          },
          (error: Error) => {
            console.log(error);
            Swal.fire('Cancelled', 'Your task is safe', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your file is safe', 'error');
      }
    });
  }

  ngOnInit(): void {
    this.fetchTasks();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    };
  }
}
