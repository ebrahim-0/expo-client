import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject(null);

  constructor(
    private _HttpClient: HttpClient,
    private _CookieService: CookieService,
    @Inject('API_URL') private API_URL: string
  ) {
    const token = this._CookieService.get('token');

    if (token) {
      this.decodeUserData(token);
    }
  }

  registerUser(user: object): Observable<any> {
    return this._HttpClient.post(`${this.API_URL}/api/v1/auth/register`, user);
  }

  loginUser(user: object): Observable<any> {
    return this._HttpClient.post(`${this.API_URL}/api/v1/auth/login`, user);
  }

  logoutUser(): void {
    this._CookieService.delete('token');
    this._CookieService.delete('user');
    this.currentUser.next(null);
  }

  decodeUserData(token: string) {
    const encodedToken: any = jwtDecode(token);
    this.currentUser.next(encodedToken);
    return encodedToken;
  }
}
