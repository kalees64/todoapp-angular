import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { UserService } from '../../sevices/user.service';
import { DataTablesModule } from 'angular-datatables';
import { BadgeComponent } from '../ui/badge/badge.component';
import { I_TASK } from '../tasks-list-all/tasks.model';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { TasksCreateComponent } from '../tasks-create/tasks-create.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuillModule } from 'ngx-quill';

import 'datatables.net';
import { Config } from 'datatables.net';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataTablesModule,
    BadgeComponent,
    NgIf,
    SweetAlert2Module,
    TasksCreateComponent,
    ReactiveFormsModule,
    QuillModule,
  ],
  templateUrl: './tasks-list.component.html',
  styles: ``,
})
export class TasksListComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private toast: ToastrService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  tasks!: I_TASK[];

  completedTasks!: I_TASK[];

  pendingTasks!: I_TASK[];

  addForm!: FormGroup;

  dtOptions: Config = {};

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

  isLoading: boolean = false;

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  fetchTasks() {
    const userId = this.userService.getUserIdFromLocalStorage();
    this.taskService.getTasks().subscribe(
      (res: any) => {
        this.tasks = res.data.filter(
          (val: I_TASK) => val.created_by === userId
        );
        this.completedTasks = res.data.filter(
          (task: I_TASK) =>
            task.status === 'COMPLETED' && task.created_by === userId
        );
        this.pendingTasks = res.data.filter(
          (task: I_TASK) =>
            task.status === 'PENDING' && task.created_by === userId
        );
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  completeTask(id: number, task: I_TASK) {
    const completeTask = {
      name: task.name,
      created_by: task.created_by,
      status: 'COMPLETED',
      description: task.description,
    };
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

  deleteTask(id: number, task: I_TASK) {
    console.log(id);
    Swal.fire({
      title: `Do you want to delete ${task.name}`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe(
          (res: any) => {
            console.log(res);
            Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            this.ngOnInit();
          },
          (error: Error) => {
            console.log(error);
            Swal.fire('Cancelled', 'Your task is safe', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your file is safe', 'error');
      }
    });
  }

  onSubmit() {
    const userId = this.userService.getUserIdFromLocalStorage();
    console.log(this.addForm.value);
    this.startLoading();
    this.taskService
      .addTask({ ...this.addForm.value, created_by: userId })
      .subscribe(
        (res: any) => {
          this.stopLoading();
          console.log(res.data);
          this.toast.success('Task Added');
          this.ngOnInit();
          this.reloadTable();
        },
        (error: Error) => {
          console.log(error);
          this.stopLoading();
          this.toast.error(error.message);
        }
      );
  }

  ngOnInit(): void {
    this.fetchTasks();

    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      status: ['PENDING'],
      description: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    };
  }

  reloadTable() {
    this.tasks = [];
    this.fetchTasks();
  }

  get name() {
    return this.addForm.controls['name'];
  }

  get description() {
    return this.addForm.controls['description'];
  }
}
