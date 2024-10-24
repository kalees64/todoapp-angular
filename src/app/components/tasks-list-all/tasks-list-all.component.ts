import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { I_TASK } from './tasks.model';
import Swal from 'sweetalert2';
import { UserService } from '../../sevices/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I_USER } from '../register/user.model';

@Component({
  selector: 'app-tasks-list-all',
  templateUrl: './tasks-list-all.component.html',
  styles: ``,
})
export class TasksListAllComponent implements OnInit {
  constructor(
    private taskService: TaskService,
    private toast: ToastrService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  tasks!: I_TASK[];

  users!: I_USER[];

  completedTasks!: I_TASK[];

  pendingTasks!: I_TASK[];

  user!: I_USER;

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
    this.taskService.getTasksWithCreater().subscribe(
      (res: any) => {
        this.tasks = res.data;
        this.groupByWeek(res.data);
        this.completedTasks = res.data.filter(
          (task: I_TASK) => task.status === 'COMPLETED'
        );
        this.pendingTasks = res.data.filter(
          (task: I_TASK) => task.status === 'PENDING'
        );
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
    const newTask = {
      ...this.addForm.value,
      created_by: userId,
      completed_date: null,
      assigned_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      assigned_to: Number(this.addForm.value['assigned_to']),
    };
    console.log(newTask);

    this.startLoading();
    this.taskService.addTask(newTask).subscribe(
      (res: any) => {
        console.log(res.data);
        this.stopLoading();
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

  groupByWeek(data: I_TASK[]) {
    // Convert string dates to Date objects and sort the data
    const sortedData = data
      .map((item) => ({
        ...item,
        created_at: new Date(item.created_at),
      }))
      .sort((a: any, b: any) => a.created_at - b.created_at);

    const groupedData = [];
    let currentWeek: any = [];
    let weekStart: any = null;

    sortedData.forEach((item, index) => {
      const itemDate = item.created_at;

      // Determine the start of the week (Monday)
      const startOfWeek = new Date(itemDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Adjust to Monday

      // If starting a new week, push the current week to groupedData and reset it
      if (!weekStart || weekStart.getTime() !== startOfWeek.getTime()) {
        if (currentWeek.length > 0) {
          groupedData.push(currentWeek);
        }
        currentWeek = [];
        weekStart = startOfWeek;
      }

      currentWeek.push(item);
    });

    // Push the last group if it exists
    if (currentWeek.length > 0) {
      groupedData.push(currentWeek);
    }

    console.log('Group by Week:', groupedData);

    return groupedData;
  }

  ngOnInit(): void {
    this.fetchTasks();

    this.userService.getAllUsers().subscribe(
      (res: any) => {
        console.log(res.data);
        this.users = res.data;
      },
      (error: Error) => {
        console.log(error);
      }
    );

    this.user = this.userService.getUserFromLocalStorage();

    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(4)]],
      status: ['PENDING'],
      description: [null],
      priority: [null],
      due_date: [null],
      assigned_to: [null, [Validators.required]],
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

  get priority() {
    return this.addForm.controls['priority'];
  }

  get due_date() {
    return this.addForm.controls['due_date'];
  }

  get assigned_to() {
    return this.addForm.controls['assigned_to'];
  }
}
