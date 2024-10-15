import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../sevices/user.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const toast = inject(ToastrService);
  const userRole = userService.getUserRoleFromLocalStorage();
  if (userRole === 'ADMIN') {
    return true;
  } else {
    toast.error('Only admin have access to all tasks');
    return false;
  }
};
