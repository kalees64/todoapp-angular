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
  ) {}

  id!: number;

  task!: I_TASK;

  imgURL: any;

  fetchTask() {
    this.taskService.getTaskBtIdWithCreator(this.id).subscribe(
      (res: any) => {
        if (res.data.image) {
          this.taskService.getImage(res.data.image).subscribe(
            (res: any) => {
              console.log(res);
              const objectURL = URL.createObjectURL(res);
              this.imgURL = objectURL;
            },
            (error: Error) => {
              console.log(error);
            }
          );
        }

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
