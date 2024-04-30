import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, InputTextModule, CommonModule, ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [
    trigger('opacityScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('75ms ease-in', style({ opacity: 0, transform: 'scale(.95)' })),
      ]),
    ]),
  ],
})
export class NavbarComponent implements OnInit {
  isMobileMenu = false;

  currentUser!: any;

  // { path: 'about-us', label: 'About Us' },
  // { path: 'show-time', label: 'Show Time' },
  navLinks = [
    { path: 'work-time', label: 'Work Time' },
    { path: 'pavilions', label: 'pavilions' },
    { path: 'facilities', label: 'Facilities' },
    { path: 'ticket', label: 'Ticket' },
  ];

  adminLinks = [{ path: 'users', label: 'Users' }];

  constructor(private _AuthService: AuthService, private _Router: Router) {}

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this._AuthService.logoutUser();

    // this._MessageService.add({
    //   severity: 'info',
    //   summary: 'Logout',
    //   detail: 'You have been logged out successfully',
    // });
  }

  navigateToRegister() {
    this._AuthService.currentUser.subscribe({
      next: (user) => {
        if (user?.rule === 'admin') {
          this._Router.navigate(['/register'], {
            queryParams: { rule: 'admin' },
          });
        } else {
          this._Router.navigateByUrl('/register');
        }
      },
    });
  }

  closeMenu() {
    this.isMobileMenu = false;
  }

  toggleMobileMenu() {
    this.isMobileMenu = !this.isMobileMenu;
  }
}
