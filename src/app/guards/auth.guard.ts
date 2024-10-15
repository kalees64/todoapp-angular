import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../sevices/user.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toast = inject(ToastrService);
  const router = inject(Router);
  const userId = userService.getUserIdFromLocalStorage();
  if (userId) {
    return true;
  } else {
    toast.error('You are not logged in, please login');
    setTimeout(() => {
      router.navigateByUrl('/login');
    }, 2000);
    return false;
  }
};
