import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const toastrService = inject(ToastrService);
  return accountService.currentUser$.pipe(
    map((user: User | null) => {
      if (!user) return false;

      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      }
      toastrService.error("You cannot access this path");
      return false;
    })
  )
};
