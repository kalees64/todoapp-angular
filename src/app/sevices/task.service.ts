import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  I_ADD_TASK,
  I_UPDATE_TASK,
} from '../components/tasks-list-all/tasks.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {
    this.serverURL = environment.API_URL;
  }

  serverURL: string;

  getTasks() {
    const url = `${this.serverURL}/tasks`;
    return this.http.get(url);
  }

  getTasksWithCreater() {
    const url = `${this.serverURL}/tasks?fields=id,name,status,description,created_by,created_by.id,created_by.name,created_at,assigned_to,assigned_to.id,assigned_to.name,priority,completed_date,due_date,modified_at,assigned_date`;
    return this.http.get(url);
  }

  getTaskBtId(id: number) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.get(url);
  }

  getTaskBtIdWithCreator(id: number) {
    const url = `${this.serverURL}/tasks/${id}?fields=id,name,status,description,created_by,created_by.id,created_by.name,created_at,assigned_to,assigned_to.id,assigned_to.name,priority,completed_date,due_date,modified_at,assigned_date,image`;
    return this.http.get(url);
  }

  addTask(task: any) {
    const url = `${this.serverURL}/tasks`;
    return this.http.post(url, task);
  }

  updateTask(id: number, task: any) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.patch(url, task);
  }

  deleteTask(id: number) {
    const url = `${this.serverURL}/tasks/${id}`;
    return this.http.delete(url);
  }

  uploadImage(image: any) {
    const url = `${environment.API_URL_FILES}`;
    return this.http.post(url, image);
  }

  getImage(id: string) {
    const url = `${environment.API_URL_ASSETS}/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
