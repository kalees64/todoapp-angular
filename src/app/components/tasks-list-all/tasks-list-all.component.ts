import { Component, OnInit } from '@angular/core';
import { I_TASK } from '../../utils/objects';
import { TaskService } from '../../sevices/task.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks-list-all',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tasks-list-all.component.html',
  styles: ``,
})
export class TasksListAllComponent implements OnInit {
  constructor(private taskService: TaskService, private toast: ToastrService) {}

  tasks!: I_TASK[];

  fetchTasks() {
    this.taskService.getTasks().subscribe(
      (res: any) => {
        this.tasks = res;
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  completeTask(id: string, task: I_TASK) {
    const completeTask = { ...task, status: 'COMPLETED' };
    this.taskService.updateTask(id, completeTask).subscribe(
      (res: any) => {
        console.log(res);
        this.toast.success('Task Completed');
        this.ngOnInit();
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe(
      (res: any) => {
        console.log(res);
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
  }
}
