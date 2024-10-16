import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../sevices/user.service';
import { I_USER } from '../../utils/objects';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private userService: UserService
  ) {}

  regForm!: FormGroup;

  onSubmit() {
    this.userService.addUser(this.regForm.value).subscribe(
      (res: any) => {
        console.log(res.data);
        if (res.data.id) {
          this.toast.success('Register successful');
          this.userService.login(res.data.email, res.data.password);
        } else {
          this.toast.error('Register failed');
        }
      },
      (error: Error) => {
        console.log(error);
        this.toast.error(error.message);
      }
    );
  }

  ngOnInit(): void {
    this.regForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
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
      role: ['', Validators.required],
    });
  }

  get name() {
    return this.regForm.controls['name'];
  }

  get email() {
    return this.regForm.controls['email'];
  }

  get password() {
    return this.regForm.controls['password'];
  }

  get role() {
    return this.regForm.controls['role'];
  }
}
