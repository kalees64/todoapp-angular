import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I_NEW_USER, I_USER } from '../utils/objects';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  serverURL = 'https://cms.krudraksha.com/items';

  isLoggedIn: boolean = false;

  isAdminLoggedIn: boolean = false;

  login(email: string, password: string) {
    const url = `${this.serverURL}/users`;
    return this.http.get(url).subscribe(
      (res: any) => {
        console.log(res.data);
        const user: I_USER = res.data.find(
          (val: I_USER) => val.email === email && val.password === password
        );
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.toast.success('Login Success');
          if (user.role === 'ADMIN') {
            this.isAdminLoggedIn = true;
            this.isLoggedIn = true;
            this.router.navigateByUrl('/tasks/all');
          } else {
            this.isLoggedIn = true;
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

  logout() {
    const user = this.getUserIdFromLocalStorage();
    if (user) {
      localStorage.removeItem('user');
      this.isAdminLoggedIn = false;
      this.isLoggedIn = false;
      this.toast.success('Logged Out');
      this.router.navigateByUrl('/login');
    } else {
      this.toast.error('You are not logged in');
    }
  }

  getUserIdFromLocalStorage() {
    const res = localStorage.getItem('user');
    if (res) {
      return JSON.parse(res).id;
    }
  }

  getUserRoleFromLocalStorage() {
    const res = localStorage.getItem('user');
    if (res) {
      return JSON.parse(res).role;
    }
  }

  getAllUsers() {
    const url = `${this.serverURL}/users`;
    return this.http.get(url);
  }

  addUser(user: I_NEW_USER) {
    const url = `${this.serverURL}/users`;
    return this.http.post(url, user);
  }
}
