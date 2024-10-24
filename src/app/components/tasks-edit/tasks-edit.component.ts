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
import { I_USER } from '../register/user.model';

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
  users!: I_USER[];

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
        if (res.data.due_date !== null) {
          const taskData = {
            ...res.data,
            due_date: res.data.due_date.substring(0, 10),
          };
          this.updateForm.patchValue(taskData);
        } else {
          this.updateForm.patchValue(res.data);
        }
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
        completed_date: null,
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

    this.userService.getAllUsers().subscribe(
      (res: any) => {
        this.users = res.data;
      },
      (error: Error) => {
        console.log(error);
      }
    );

    this.updateForm = this.fb.group({
      id: [null, Validators.required],
      name: [null, [Validators.required, Validators.minLength(3)]],
      status: [null, Validators.required],
      description: [null],
      created_by: [null, Validators.required],
      assigned_date: [null],
      assigned_to: [null],
      completed_date: [null],
      created_at: [null],
      due_date: [null],
      modified_at: [null],
      priority: [null],
    });
    this.userRole = this.userService.getUserRoleFromLocalStorage();
  }

  get name() {
    return this.updateForm.controls['name'];
  }

  get status() {
    return this.updateForm.controls['status'];
  }

  get priority() {
    return this.updateForm.controls['priority'];
  }

  get assigned_to() {
    return this.updateForm.controls['assigned_to'];
  }

  get due_date() {
    return this.updateForm.controls['due_date'];
  }

  get description() {
    return this.updateForm.controls['description'];
  }
}
