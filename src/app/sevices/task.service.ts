import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I_ADD_TASK, I_TASK, I_UPDATE_TASK } from '../utils/objects';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  serverURL = 'http://localhost:3000';

  getTasks() {
    const url = `${this.serverURL}/tasks`;
    return this.http.get(url);
  }

  getTaskBtId(id: string) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.get(url);
  }

  addTask(task: I_ADD_TASK) {
    const url = `${this.serverURL}/tasks`;
    return this.http.post(url, task);
  }

  updateTask(id: string, task: I_UPDATE_TASK) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.put(url, task);
  }

  deleteTask(id: string) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.delete(url);
  }
}
