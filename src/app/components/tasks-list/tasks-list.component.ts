import { Component } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../../utils/objects';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../sevices/user.service';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTablesModule],
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

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(
      (res: any) => {
        this.toast.success('Task Deleted');
        this.ngOnInit();
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
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
