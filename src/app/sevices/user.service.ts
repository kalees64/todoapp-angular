import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I_NEW_USER, I_USER } from '../utils/objects';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {
    this.serverURL = environment.API_URL;
  }

  serverURL: string;

  isLoggedIn: boolean = false;

  isAdminLoggedIn: boolean = false;

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
