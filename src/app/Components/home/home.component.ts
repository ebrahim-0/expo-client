import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  currentUser: any;

  constructor(
    private _AuthService: AuthService,
    private _CookieService: CookieService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;

        if (user?.rule !== 'employee') {
          this._Router.navigate(['/about-us']);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._Router.navigate(['/about-us']);
    }
  }

  loginAsGuest() {
    this._AuthService.loginAsGuest().subscribe({
      next: (res) => {
        this._CookieService.set('token', res.token);

        this._AuthService.decodeUserData(res.token);

        this._Router.navigate(['/about-us']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
