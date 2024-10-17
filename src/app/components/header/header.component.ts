import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../sevices/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, SweetAlert2Module],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.user = this.userService.user;
  }

  user: any;

  confirmLogout() {
    Swal.fire({
      title: 'Do you want to logout?',
      text: 'You will be logged out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
        // Swal.fire('Logged out success', '', 'success');
      } else {
        // Swal.fire('You are not logged out', '', 'error');
      }
    });
  }

  logout() {
    const userId = this.userService.getUserIdFromLocalStorage();
    if (userId) {
      localStorage.removeItem('user');
      this.userService.isAdminLoggedIn = false;
      this.userService.isLoggedIn = false;
      this.toast.success('Logged Out');
      // Swal.fire('Logged out success', '', 'success');
      this.userService.logout();
      this.router.navigateByUrl('/login');
    } else {
      this.toast.error('You are not logged in');
      // Swal.fire('You are not logged out', '', 'error');
    }
  }

  ngOnInit(): void {}
}
