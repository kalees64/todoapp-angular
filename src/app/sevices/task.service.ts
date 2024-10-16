import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { I_ADD_TASK, I_UPDATE_TASK } from '../utils/objects';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  serverURL = 'https://cms.krudraksha.com/items';

  getTasks() {
    const url = `${this.serverURL}/tasks`;
    return this.http.get(url);
  }

  getTaskBtId(id: number) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.get(url);
  }

  addTask(task: I_ADD_TASK) {
    const url = `${this.serverURL}/tasks`;
    return this.http.post(url, task);
  }

  updateTask(id: number, task: I_UPDATE_TASK) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.patch(url, task);
  }

  deleteTask(id: number) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.delete(url);
  }
}
