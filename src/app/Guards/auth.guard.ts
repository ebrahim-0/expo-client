import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(CookieService).get('token');

  const currentUser = inject(AuthService).currentUser;

  if (token) {
    if (currentUser.value?.rule === 'guest') {
      return true;
    } else {
      inject(Router).navigate(['/']);
      return false;
    }
  } else {
    return true;
  }
};
