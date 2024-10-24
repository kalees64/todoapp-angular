import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { I_NEW_USER, I_USER } from '../components/register/user.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
    this.serverURL = environment.API_URL;
    this.user.set(this.getUserFromLocalStorage());
    console.log('UserService : ', this.user());
    console.log('UserService Local : ', this.getUserFromLocalStorage());
  }

  user = signal<any | null>(null);

  serverURL: string;

  isLoggedIn: boolean = false;

  isAdminLoggedIn: boolean = false;

  login(email: string, password: string) {
    const url = `${this.serverURL}/users`;
    return this.http.get(url).pipe(
      map((res: any) => {
        const user: I_USER = res.data.find(
          (val: I_USER) => val.email === email && val.password === password
        );
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          console.log(user);
          this.user.set(user);
        }
        return user;
      })
    );
  }

  logout() {
    console.log('Logout');
    this.user.set(null);
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

  getUserFromLocalStorage() {
    const res = localStorage.getItem('user');
    if (res) {
      const user = JSON.parse(res);
      return user;
    } else {
      return null;
    }
  }

  getAllUsers() {
    const url = `${this.serverURL}/users`;
    return this.http.get(url);
  }

  getUserById(id: number) {
    const url = `${this.serverURL}/users/${id}`;
    return this.http.get(url);
  }

  addUser(user: I_NEW_USER) {
    const url = `${this.serverURL}/users`;
    return this.http.post(url, user);
  }
}
