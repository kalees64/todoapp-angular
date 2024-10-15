import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../sevices/user.service';

@Component({
  selector: 'app-tasks-create',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tasks-create.component.html',
  styles: ``,
})
export class TasksCreateComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private toast: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  addForm!: FormGroup;

  onSubmit() {
    const userId = this.userService.getUserIdFromLocalStorage();
    this.taskService
      .addTask({ ...this.addForm.value, created_by: userId })
      .subscribe(
        (res: any) => {
          console.log(res);
          this.toast.success('Task Added');
          this.router.navigateByUrl('/tasks');
        },
        (error: Error) => {
          console.log(error);
          this.toast.error(error.message);
        }
      );
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: ['PENDING'],
    });
  }

  get name() {
    return this.addForm.controls['name'];
  }
}
