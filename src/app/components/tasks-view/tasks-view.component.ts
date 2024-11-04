import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks-view',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './tasks-view.component.html',
  styles: ``,
})
export class TasksViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private location: Location,
    private toast: ToastrService
  ) {
    this.img = Math.floor(Math.random() * 4);
    console.log(this.img);
    if (this.img === 0) {
      this.img = 1;
    }
  }

  id!: number;

  task!: I_TASK;

  img: number = 1;

  fetchTask() {
    this.taskService.getTaskBtIdWithCreator(this.id).subscribe(
      (res: any) => {
        this.task = res.data;
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  completeTask(id: number, task: I_TASK) {
    const completeTask = {
      ...task,
      name: task.name,
      created_by: task.created_by.id,
      status: 'COMPLETED',
      description: task.description,
      completed_date: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      assigned_to: task.assigned_to.id,
    };
    console.log(completeTask);
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

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.fetchTask();
  }
}
