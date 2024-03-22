import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './Services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Expo';

  currentUser: any;

  constructor(
    private _HttpClient: HttpClient,
    private _AuthService: AuthService,
    private _Router: Router,
    private _CookieService: CookieService,
    @Inject('API_URL') private API_URL: string
  ) {}

  ngOnInit(): void {
    this._HttpClient.get(`${this.API_URL}/api/v1`).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this._AuthService.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  @HostListener('window:load', ['$event'])
  loadHandler(event: any) {
    const token = this._CookieService.get('token');
    if (!token) {
      this._Router.navigate(['/']);
    } else {
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    if (this.currentUser?.rule === 'guest') {
      this._AuthService.logoutUser();
    } else {
      return;
    }
  }
}
