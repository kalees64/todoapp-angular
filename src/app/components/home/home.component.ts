import { Component, OnInit } from '@angular/core';
import { UserService } from '../../sevices/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService) {}

  userStatus!: boolean;

  ngOnInit(): void {
    const userId = this.userService.getUserIdFromLocalStorage();
    if (userId) {
      this.userStatus = true;
    } else {
      this.userStatus = false;
    }
  }
}
