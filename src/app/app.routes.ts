import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './Guards/auth.guard';
import { pageGuard } from './Guards/page.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./Components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'register',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./Components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'about-us',

    canActivate: [pageGuard],

    loadComponent: () =>
      import('./Components/aboutus/aboutus.component').then(
        (m) => m.AboutusComponent
      ),
  },

  {
    path: 'forgot-password',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./Components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },

  {
    path: 'verify-reset-code',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./Components/verify-reset-code/verify-reset-code.component').then(
        (m) => m.VerifyResetCodeComponent
      ),
  },
  {
    path: 'reset-password',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./Components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },

  {
    path: '**',
    loadComponent: () =>
      import('./Components/not-founded/not-founded.component').then(
        (m) => m.NotFoundedComponent
      ),
  },
];
