import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../tasks-list-all/tasks.model';

@Component({
  selector: 'app-tasks-view',
  standalone: true,
  imports: [],
  templateUrl: './tasks-view.component.html',
  styles: ``,
})
export class TasksViewComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  id!: number;
  task!: I_TASK;

  fetchTask() {
    this.taskService.getTaskBtId(this.id).subscribe(
      (res: any) => {
        this.task = res.data;
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.fetchTask();
  }
}
