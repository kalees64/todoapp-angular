import { Component, OnInit } from '@angular/core';
import { UserService } from '../../sevices/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}

  userStatus!: boolean;
  userRole!: string;

  ngOnInit(): void {
    const userId = this.userService.getUserIdFromLocalStorage();
    this.userRole = this.userService.getUserRoleFromLocalStorage();
    if (userId) {
      this.userStatus = true;
    } else {
      this.userStatus = false;
    }
  }
}
