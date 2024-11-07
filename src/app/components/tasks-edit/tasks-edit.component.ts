import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { CommonModule, Location } from '@angular/common';
import { I_USER } from '../register/user.model';
import Swal from 'sweetalert2';
import { ImagePreviewPipe } from '../tasks-list-all/imagePreview.pipe';

@Component({
  selector: 'app-tasks-edit',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule, ImagePreviewPipe],
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

  imgURL: any;

  imgState: boolean = true;

  newImage: string | null = null;

  imageDelete() {
    this.imgState = false;
    this.updateForm.value['image'] = null;
    // console.log('Delete');
  }

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

  imagePreview: string | ArrayBuffer | null = null;

  onUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.updateForm.patchValue({ image: file });
      this.updateForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Store the dataURL in imagePreview
      };
      reader.readAsDataURL(file); // Convert file to dataURL
    }
  }

  fetchTask() {
    this.taskService.getTaskBtId(this.id).subscribe(
      (res: any) => {
        this.task = res.data;
        console.log(res);
        if (res.data.due_date !== null) {
          const taskData = {
            ...res.data,
            due_date: res.data.due_date.substring(0, 10),
          };
          this.updateForm.patchValue(taskData);
        }
        if (res.data.image !== null) {
          console.log('I am WOrking');
          this.taskService.getImage(res.data.image).subscribe(
            (res: any) => {
              const objectURL = URL.createObjectURL(res);
              this.imgURL = objectURL;
            },
            (error: Error) => {
              console.log(error);
            }
          );
        }
        this.updateForm.patchValue(res.data);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  removeImage() {
    Swal.fire({
      title: 'Do you want to remove image?',
      text: 'Your attachment will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
    }).then((result) => {
      if (result.isConfirmed) {
        this.imageDelete();
        // Swal.fire('Logged out success', '', 'success');
      } else {
        // Swal.fire('You are not logged out', '', 'error');
      }
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.updateForm.get('image')?.value);

    if (
      (this.file !== null || this.updateForm.value['image'] !== null) &&
      !this.imgState
    ) {
      console.log('if');
      if (this.file !== null) {
        const formData = new FormData();
        formData.append('file', this.file);
        this.taskService.uploadImage(formData).subscribe(
          (res: any) => {
            console.log(res);
            this.newImage = res.data.id;
            console.log(this.newImage);

            if (this.updateForm.value['status'] === 'COMPLETED') {
              const updatedTask = {
                ...this.updateForm.value,
                modified_at: new Date().toISOString(),
                completed_date: new Date().toISOString(),
                image: this.newImage,
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
                image: this.newImage,
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
          },
          (error: Error) => {
            console.log(error);
          }
        );
      }
    } else if (
      (this.file === null || this.updateForm.value['image'] === null) &&
      !this.imgState
    ) {
      console.log('else if');
      if (this.updateForm.value['status'] === 'COMPLETED') {
        const updatedTask = {
          ...this.updateForm.value,
          modified_at: new Date().toISOString(),
          completed_date: new Date().toISOString(),
          image: this.newImage,
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
          image: this.newImage,
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
    } else {
      console.log('else');

      if (this.file === null && this.updateForm.value['image'] === null) {
        if (this.updateForm.value['status'] === 'COMPLETED') {
          const updatedTask = {
            ...this.updateForm.value,
            modified_at: new Date().toISOString(),
            completed_date: new Date().toISOString(),
            image: this.newImage,
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
            image: this.newImage,
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
      } else if (this.file !== null) {
        const formData = new FormData();
        formData.append('file', this.file);
        this.taskService.uploadImage(formData).subscribe(
          (res: any) => {
            console.log(res);
            this.newImage = res.data.id;
            console.log(this.newImage);

            if (this.updateForm.value['status'] === 'COMPLETED') {
              const updatedTask = {
                ...this.updateForm.value,
                modified_at: new Date().toISOString(),
                completed_date: new Date().toISOString(),
                image: this.newImage,
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
                image: this.newImage,
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
          },
          (error: Error) => {
            console.log(error);
          }
        );
      } else {
        if (this.updateForm.value['status'] === 'COMPLETED') {
          const updatedTask = {
            ...this.updateForm.value,
            modified_at: new Date().toISOString(),
            completed_date: new Date().toISOString(),
            image: this.updateForm.value['image'],
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
            image: this.updateForm.value['image'],
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
    }
  }

  goBack() {
    this.location.back();
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
      description_text: [null],
      created_by: [null, Validators.required],
      assigned_date: [null],
      assigned_to: [null],
      completed_date: [null],
      created_at: [null],
      due_date: [null],
      modified_at: [null],
      priority: [null],
      image: [null],
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
