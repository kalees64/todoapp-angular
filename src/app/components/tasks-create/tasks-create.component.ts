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
import { QuillModule } from 'ngx-quill';
import { SharedModuleModule } from '../../shared-module/shared-module.module';

@Component({
  selector: 'app-tasks-create',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, SharedModuleModule],
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

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: [7, 1, 2, 3, 4, 5, 6] }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: [] }],
      ['clean'],
    ],
  };

  onSubmit() {
    const userId = this.userService.getUserIdFromLocalStorage();
    console.log(this.addForm.value);
    this.taskService
      .addTask({ ...this.addForm.value, created_by: userId })
      .subscribe(
        (res: any) => {
          console.log(res.data);
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
      name: ['', [Validators.required, Validators.minLength(4)]],
      status: ['PENDING'],
      description: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get name() {
    return this.addForm.controls['name'];
  }

  get description() {
    return this.addForm.controls['description'];
  }
}
