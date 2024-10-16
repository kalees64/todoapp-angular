import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../sevices/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private router: Router
  ) {}

  logout() {
    const user = this.userService.getUserIdFromLocalStorage();
    if (user) {
      localStorage.removeItem('user');
      this.userService.isAdminLoggedIn = false;
      this.userService.isLoggedIn = false;
      this.toast.success('Logged Out');
      this.router.navigateByUrl('/login');
    } else {
      this.toast.error('You are not logged in');
    }
  }
}
