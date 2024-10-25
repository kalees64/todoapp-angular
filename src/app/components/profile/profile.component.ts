import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I_USER } from '../register/user.model';
import { UserService } from '../../sevices/user.service';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styles: ``,
})
export class ProfileComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {}

  id!: number;

  user!: I_USER;

  userForm!: FormGroup;

  onSubmit() {
    console.log(this.userForm.value);
    this.userService.updateUser(this.id, this.userForm.value).subscribe(
      (res: any) => {
        console.log(res.data);
        if (res.data) {
          this.toast.success('Profile updated successfully');
        } else {
          this.toast.error('Failed to update profile');
        }
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.userForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      work_start_time: [null],
      work_end_time: [null],
    });

    this.userService.getUserById(this.route.snapshot.params['id']).subscribe(
      (res: any) => {
        this.user = res.data;
        this.userForm.patchValue(res.data);
      },
      (error: Error) => {
        console.log(error);
      }
    );
  }

  get name() {
    return this.userForm.controls['name'];
  }

  get email() {
    return this.userForm.controls['email'];
  }

  get role() {
    return this.userForm.controls['role'];
  }
}
