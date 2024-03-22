import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const currentUser = inject(AuthService).currentUser.value;

  if (currentUser?.rule === 'admin') {
    return true;
  } else {
    inject(Router).navigate(['/']);
    return false;
  }
};
