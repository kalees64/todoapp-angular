import { Component } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../../utils/objects';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../sevices/user.service';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  fetchTasks() {
    const userId = this.userService.getUserIdFromLocalStorage();
    this.taskService.getTasks().subscribe(
      (res: any) => {
        this.tasks = res.filter((val: I_TASK) => val.created_by === userId);
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
