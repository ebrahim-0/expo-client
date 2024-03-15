import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const pageGuard: CanActivateFn = (route, state) => {
  const token = inject(CookieService).get('token');

  if (token) {
    return true;
  } else {
    inject(Router).navigate(['/']);
    return false;
  }
};
