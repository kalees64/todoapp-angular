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
import { UserService } from '../../sevices/user.service';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-tasks-edit',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule],
  templateUrl: './tasks-edit.component.html',
  styles: ``,
})
export class TasksEditComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private taskService: TaskService,
    private userService: UserService
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  id!: number;
  task!: I_TASK;
  updateForm!: FormGroup;
  userRole!: string;

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

  fetchTask() {
    this.taskService.getTaskBtId(this.id).subscribe(
      (res: any) => {
        this.task = res.data;
        this.updateForm.patchValue(res.data);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    this.taskService.updateTask(this.id, this.updateForm.value).subscribe(
      (res: any) => {
        console.log(res.data);
        this.toast.success('Task Updated');
        if (this.userRole === 'ADMIN') {
          this.router.navigateByUrl('/admin/tasks');
        } else {
          this.router.navigateByUrl('/tasks');
        }
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
      description: ['Description', Validators.required],
      created_by: ['', Validators.required],
    });
    this.userRole = this.userService.getUserRoleFromLocalStorage();
  }

  get name() {
    return this.updateForm.controls['name'];
  }

  get status() {
    return this.updateForm.controls['status'];
  }

  get description() {
    return this.updateForm.controls['description'];
  }
}
