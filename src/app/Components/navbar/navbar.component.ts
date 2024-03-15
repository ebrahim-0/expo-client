import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../Services/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  isMobileMenu = false;

  currentUser!: any;

  navLinks = [
    { path: 'about-us', label: 'About Us' },
    { path: 'work-time', label: 'Work Time' },
    { path: 'pavilions', label: 'pavilions' },
    { path: 'facilities', label: 'Facilities' },
    { path: 'ticket', label: 'Ticket' },
  ];

  constructor(
    private _AuthService: AuthService,
    private _MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout() {
    this._AuthService.logoutUser();

    this._MessageService.add({
      severity: 'info',
      summary: 'Logout',
      detail: 'You have been logged out successfully',
    });
  }

  closeMenu() {
    this.isMobileMenu = false;
  }

  toggleMobileMenu() {
    this.isMobileMenu = !this.isMobileMenu;
  }
}
