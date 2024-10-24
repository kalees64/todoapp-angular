import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { CommonModule, DatePipe, Location } from '@angular/common';

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
    private location: Location
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

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.fetchTask();
  }
}
