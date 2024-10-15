import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../sevices/task.service';
import { I_TASK } from '../../utils/objects';

@Component({
  selector: 'app-tasks-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tasks-edit.component.html',
  styles: ``,
})
export class TasksEditComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private taskService: TaskService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  id!: string;
  task!: I_TASK;
  updateForm!: FormGroup;

  fetchTask() {
    this.taskService.getTaskBtId(this.id).subscribe(
      (res: any) => {
        this.task = res;
        this.updateForm.patchValue(res);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.taskService.updateTask(this.id, this.updateForm.value).subscribe(
      (res: any) => {
        console.log(res);
        this.toast.success('Task Updated');
        this.router.navigateByUrl('/tasks');
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchTask();
    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      created_by: ['', Validators.required],
    });
  }

  get name() {
    return this.updateForm.controls['name'];
  }

  get status() {
    return this.updateForm.controls['status'];
  }
}
