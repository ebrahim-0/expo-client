import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { authGuard } from './Guards/auth.guard';

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
    loadComponent: () =>
      import('./Components/aboutus/aboutus.component').then(
        (m) => m.AboutusComponent
      ),
  },
];
