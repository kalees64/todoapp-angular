import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from '../../sevices/task.service';
import { UserService } from '../../sevices/user.service';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { QuillModule } from 'ngx-quill';
import { Location } from '@angular/common';

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
    private toast: ToastrService,
    private taskService: TaskService,
    private userService: UserService,
    private location: Location
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
    if (this.updateForm.value['status'] === 'COMPLETED') {
      const updatedTask = {
        ...this.updateForm.value,
        modified_at: new Date().toISOString(),
        completed_date: new Date().toISOString(),
        created_by: this.updateForm.value['created_by'].id,
      };

      console.log(updatedTask);

      this.taskService.updateTask(this.id, updatedTask).subscribe(
        (res: any) => {
          console.log(res.data);
          this.toast.success('Task Updated');
          this.location.back();
        },
        (error: Error) => {
          console.log(error);
        }
      );
    } else {
      const updatedTask = {
        ...this.updateForm.value,
        modified_at: new Date().toISOString(),
      };

      console.log(updatedTask);

      this.taskService.updateTask(this.id, updatedTask).subscribe(
        (res: any) => {
          console.log(res.data);
          this.toast.success('Task Updated');
          this.location.back();
        },
        (error: Error) => {
          console.log(error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchTask();
    this.updateForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      description: ['Description', Validators.required],
      created_by: ['', Validators.required],
      assigned_date: [''],
      assigned_to: [''],
      completed_date: [''],
      created_at: [''],
      due_date: [''],
      modified_at: [''],
      priority: [''],
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
