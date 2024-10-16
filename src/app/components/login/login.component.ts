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
    private router: Router
  ) {}

  formData!: FormGroup;

  onSubmit() {
    this.userService.login(
      this.formData.value.email,
      this.formData.value.password
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
