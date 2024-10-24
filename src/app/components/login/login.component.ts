import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../sevices/user.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: ToastrService
  ) {}

  formData!: FormGroup;

  isLoading: boolean = false;

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  onSubmit() {
    this.startLoading();
    this.userService
      .login(this.formData.value.email, this.formData.value.password)
      .subscribe(
        (user: any) => {
          if (user) {
            this.toast.success('Login Success');
            this.stopLoading();
            if (user.role === 'ADMIN') {
              this.userService.isAdminLoggedIn = true;
              this.userService.isLoggedIn = true;
              this.router.navigateByUrl('/admin');
            } else {
              this.userService.isLoggedIn = true;
              this.router.navigateByUrl('/tasks');
            }
          } else {
            this.stopLoading();
            this.toast.error('Invalid email & password');
          }
        },
        (error: Error) => {
          console.log(error);
          this.stopLoading();
          this.toast.error(error.message);
        }
      );
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.formData.controls['email'];
  }

  get password() {
    return this.formData.controls['password'];
  }
}
