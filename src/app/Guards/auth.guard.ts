import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(CookieService).get('token');

  if (token) {
    inject(Router).navigate(['/']);
    return false;
  } else {
    return true;
  }
};
