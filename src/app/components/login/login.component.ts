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
import { I_USER } from '../register/user.model';

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

  onSubmit() {
    this.userService.getAllUsers().subscribe(
      (res: any) => {
        console.log(res.data);
        const user: I_USER = res.data.find(
          (val: I_USER) =>
            val.email === this.formData.value.email &&
            val.password === this.formData.value.password
        );
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.toast.success('Login Success');
          if (user.role === 'ADMIN') {
            this.userService.isAdminLoggedIn = true;
            this.userService.isLoggedIn = true;
            this.router.navigateByUrl('/tasks/all');
          } else {
            this.userService.isLoggedIn = true;
            this.router.navigateByUrl('/tasks');
          }
        } else {
          this.toast.error('Invalid email & password');
        }
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$'
          ),
        ],
      ],
    });
  }

  get email() {
    return this.formData.controls['email'];
  }

  get password() {
    return this.formData.controls['password'];
  }
}
