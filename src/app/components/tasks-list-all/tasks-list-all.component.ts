import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskService } from '../../sevices/task.service';
import { ToastrService } from 'ngx-toastr';
import { Config } from 'datatables.net';
import { I_TASK } from './tasks.model';
import Swal from 'sweetalert2';
import { UserService } from '../../sevices/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { I_USER } from '../register/user.model';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-tasks-list-all',
  templateUrl: './tasks-list-all.component.html',
  styles: ``,
})
export class TasksListAllComponent implements OnInit, AfterViewInit {
  constructor(
    private taskService: TaskService,
    private toast: ToastrService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.today = new Date().toISOString();
  }

  tasks: I_TASK[] = [];

  users!: I_USER[];

  today = new Date().toISOString();

  completedTasks!: I_TASK[];

  pendingTasks!: I_TASK[];

  inprogressTasks!: I_TASK[];

  user!: I_USER;

  addForm!: FormGroup;

  imagePreview: string | ArrayBuffer | null = null;

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

  @ViewChild('exampleModal') modalElement: any;

  modalInstance: Modal | undefined;

  ngAfterViewInit(): void {
    // Initialize the modal instance after the view is initialized
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  // Function to open the modal manually
  openModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  // Function to close the modal manually
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  selectedStatus: string = 'all';

  filter() {
    if (this.selectedStatus === 'all') {
      this.tasks = [];
      this.fetchTasks();
    } else if (this.selectedStatus === 'fixed') {
      this.tasks = [];
      this.fetchFixedTasks();
    } else if (this.selectedStatus === 'pending') {
      this.tasks = [];
      this.fetchPendingTasks();
    } else if (this.selectedStatus === 'closed') {
      this.tasks = [];
      this.fetchClosedTasks();
    }
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
        this.inprogressTasks = res.data.filter(
          (task: I_TASK) => task.status === 'INPROGRESS'
        );
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  fetchFixedTasks() {
    this.taskService.getTasksWithCreater().subscribe(
      (res: any) => {
        this.tasks = res.data.filter(
          (task: I_TASK) => task.status === 'INPROGRESS'
        );
        this.groupByWeek(res.data);
        this.completedTasks = res.data.filter(
          (task: I_TASK) => task.status === 'COMPLETED'
        );
        this.pendingTasks = res.data.filter(
          (task: I_TASK) => task.status === 'PENDING'
        );
        this.inprogressTasks = res.data.filter(
          (task: I_TASK) => task.status === 'INPROGRESS'
        );
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  fetchClosedTasks() {
    this.taskService.getTasksWithCreater().subscribe(
      (res: any) => {
        this.tasks = res.data.filter(
          (task: I_TASK) => task.status === 'COMPLETED'
        );
        this.groupByWeek(res.data);
        this.completedTasks = res.data.filter(
          (task: I_TASK) => task.status === 'COMPLETED'
        );
        this.pendingTasks = res.data.filter(
          (task: I_TASK) => task.status === 'PENDING'
        );
        this.inprogressTasks = res.data.filter(
          (task: I_TASK) => task.status === 'INPROGRESS'
        );
        console.log(this.tasks.length);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  fetchPendingTasks() {
    this.taskService.getTasksWithCreater().subscribe(
      (res: any) => {
        this.tasks = res.data.filter(
          (task: I_TASK) => task.status === 'PENDING'
        );
        this.groupByWeek(res.data);
        this.completedTasks = res.data.filter(
          (task: I_TASK) => task.status === 'COMPLETED'
        );
        this.pendingTasks = res.data.filter(
          (task: I_TASK) => task.status === 'PENDING'
        );
        this.inprogressTasks = res.data.filter(
          (task: I_TASK) => task.status === 'INPROGRESS'
        );
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  fixTask(id: number, task: I_TASK) {
    const completeTask = {
      ...task,
      name: task.name,
      created_by: task.created_by.id,
      status: 'INPROGRESS',
      description: task.description,
      modified_at: new Date().toISOString(),
      assigned_to: task.assigned_to.id,
    };
    console.log(completeTask);
    this.taskService.updateTask(id, completeTask).subscribe(
      (res: any) => {
        console.log(res.data);
        this.toast.info('Task Fixed');
        this.ngOnInit();
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
  }

  reOpenTask(id: number, task: I_TASK) {
    const completeTask = {
      ...task,
      name: task.name,
      created_by: task.created_by.id,
      status: 'PENDING',
      description: task.description,
      modified_at: new Date().toISOString(),
      assigned_to: task.assigned_to.id,
    };
    console.log(completeTask);
    this.taskService.updateTask(id, completeTask).subscribe(
      (res: any) => {
        console.log(res.data);
        this.toast.info('Task Reopened');
        this.ngOnInit();
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
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
        this.toast.success('Task Closed');
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

  onUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.addForm.patchValue({ image: file });
      this.addForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Store the dataURL in imagePreview
      };
      reader.readAsDataURL(file); // Convert file to dataURL
    }
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
      // image: this.addForm.get('image')?.value,
      // image: this.imagePreview,
      // image: '8d2c96a4-bad3-4f81-bb8a-0830ed560152',
    };
    // console.log(newTask);

    console.log(this.file);

    if (this.file !== null) {
      const formData = new FormData();
      // formData.append('file', this.addForm.get('image')?.value);
      formData.append('file', this.file);
    }

    // this.startLoading();

    if (this.file !== null) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.taskService.uploadImage(formData).subscribe(
        (res: any) => {
          console.log(res);
          const newTask = {
            ...this.addForm.value,
            created_by: userId,
            completed_date: null,
            assigned_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            modified_at: new Date().toISOString(),
            assigned_to: Number(this.addForm.value['assigned_to']),
            image: res.data.id,
            // images: [1],
          };
          console.log(newTask);
          this.taskService.addTask(newTask).subscribe(
            (res: any) => {
              console.log(res.data);
              this.stopLoading();
              this.toast.success('Task Added');
              this.ngOnInit();
              this.reloadTable();
              this.closeModal();
            },
            (error: Error) => {
              console.log(error);
              this.stopLoading();
              this.toast.error(error.message);
            }
          );
        },
        (error: Error) => {
          console.log(error);
        }
      );
    } else {
      console.log(newTask);
      this.taskService.addTask(newTask).subscribe(
        (res: any) => {
          console.log(res.data);
          this.stopLoading();
          this.toast.success('Task Added');
          this.ngOnInit();
          this.reloadTable();
          this.closeModal();
        },
        (error: Error) => {
          console.log(error);
          this.stopLoading();
          this.toast.error(error.message);
        }
      );
    }

    // console.log(formData);
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
        const userId = this.userService.getUserIdFromLocalStorage();
        console.log(res.data);
        this.users = res.data.filter((val: I_USER) => val.id !== userId);
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
      image: [null],
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  file: File | null = null;

  // Handle file selection
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedFile = target.files ? target.files[0] : null;
    if (selectedFile && selectedFile.type.startsWith('image')) {
      this.file = selectedFile;
    }
  }

  // Handle drag-and-drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image')) {
        this.file = droppedFile;
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Handle paste event
  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const items = event.clipboardData?.items;
    if (items) {
      const imageFiles = Array.from(items)
        .filter((item) => item.type.startsWith('image'))
        .map((item) => item.getAsFile())
        .filter((file) => file) as File[];

      if (imageFiles.length > 0) {
        this.file = imageFiles[0]; // Take the first image file, since it's single file input
      }
    }
  }

  // Remove the file
  removeFile(): void {
    this.file = null;
  }
}
