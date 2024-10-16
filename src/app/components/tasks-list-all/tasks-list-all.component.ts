import { Component, OnInit } from '@angular/core';
import { I_TASK } from '../../utils/objects';
import { TaskService } from '../../sevices/task.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { BadgeComponent } from '../ui/badge/badge.component';

@Component({
  selector: 'app-tasks-list-all',
  standalone: true,
  imports: [RouterLink, DataTablesModule, BadgeComponent],
  templateUrl: './tasks-list-all.component.html',
  styles: ``,
})
export class TasksListAllComponent implements OnInit {
  constructor(private taskService: TaskService, private toast: ToastrService) {}

  tasks!: I_TASK[];

  dtOptions: Config = {};

  fetchTasks() {
    this.taskService.getTasks().subscribe(
      (res: any) => {
        this.tasks = res.data;
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
