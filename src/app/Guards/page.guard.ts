import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const pageGuard: CanActivateFn = (route, state) => {
  const _AuthService = inject(AuthService)





  if (_AuthService.currentUser?.getValue()) {
    return true;
  } else {
    inject(Router).navigate(['/']);
    return false;
  }
};
