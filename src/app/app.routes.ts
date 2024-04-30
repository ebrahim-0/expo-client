import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './Guards/auth.guard';
import { pageGuard } from './Guards/page.guard';
import { adminGuard } from './Guards/admin.guard';

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
    path: 'register-employee',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./Components/register-employee/register-employee.component').then(
        (m) => m.RegisterEmployeeComponent
      ),
  },

  {
    path: 'users',
    canActivate: [adminGuard],

    loadComponent: () =>
      import('./Components/users/users.component').then(
        (m) => m.UsersComponent
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
    path: 'pavilions',

    loadComponent: () =>
      import('./Components/pavilions/pavilions.component').then(
        (m) => m.PavilionsComponent
      ),
  },
  {
    path: 'pavilions/:country',

    loadComponent: () =>
      import('./Components/pavilion-country/pavilion-country.component').then(
        (m) => m.PavilionCountryComponent
      ),
  },
  {
    path: 'facilities',

    loadComponent: () =>
      import('./Components/facilities/facilities.component').then(
        (m) => m.FacilitiesComponent
      ),
  },
  {
    path: 'facility/:facility',

    loadComponent: () =>
      import('./Components/facility/facility.component').then(
        (m) => m.FacilityComponent
      ),
  },
  {
    path: 'saudi-vr',

    loadComponent: () =>
      import('./Components/vr/vr.component').then((m) => m.VRComponent),
  },
  {
    path: 'show-time',

    loadComponent: () =>
      import('./Components/show-time/show-time.component').then(
        (m) => m.ShowTimeComponent
      ),
  },
  {
    path: 'ticket',

    loadComponent: () =>
      import('./Components/ticket/ticket.component').then(
        (m) => m.TicketComponent
      ),
  },

  {
    path: 'ticket/book-ticket',

    loadComponent: () =>
      import('./Components/book-ticket/book-ticket.component').then(
        (m) => m.BookTicketComponent
      ),
  },

  {
    path: 'ticket/view-ticket',

    loadComponent: () =>
      import('./Components/view-ticket/view-ticket.component').then(
        (m) => m.ViewTicketComponent
      ),
  },

  // {
  //   path: 'about-us',

  //   loadComponent: () =>
  //     import('./Components/about-us/about-us.component').then(
  //       (m) => m.AboutUsComponent
  //     ),
  // },

  {
    path: 'contact-us',

    loadComponent: () =>
      import('./Components/contact-us/contact-us.component').then(
        (m) => m.ContactUsComponent
      ),
  },

  {
    path: 'work-time',
    loadComponent: () =>
      import('./Components/work-time/work-time.component').then(
        (m) => m.WorkTimeComponent
      ),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./Components/pay-success/pay-success.component').then(
        (m) => m.PaySuccessComponent
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
