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

    setTimeout(() => {
      this.currentUser.next(null);
    }, 1000);
  }

  forgotPassword(email: object): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/auth/forgotPassword`,
      email
    );
  }

  verifyResetCode(resetCode: string): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/auth/verifyResetCode`,
      {
        resetCode,
      }
    );
  }

  resendCode(userId: any): Observable<any> {
    return this._HttpClient.post(`${this.API_URL}/api/v1/auth/resendCode`, {
      userId,
    });
  }

  resetPassword(userId: string, newPassword: object): Observable<any> {
    return this._HttpClient.put(
      `${this.API_URL}/api/v1/auth/resetPassword`,
      { newPassword },
      {
        params: {
          userId,
        },
      }
    );
  }

  decodeUserData(token: string) {
    const encodedToken: any = jwtDecode(token);
    this.currentUser.next(encodedToken);
    return encodedToken;
  }
}
