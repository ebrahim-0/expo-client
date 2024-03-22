import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject('API_URL') private API_URL: string
  ) {}

  sendMessage(message: object): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/user/sendMessage`,
      message
    );
  }

  getAllUsers(): Observable<any> {
    return this._HttpClient.get(`${this.API_URL}/api/v1/user/getAllUsers`);
  }

  getUserById(id: string): Observable<any> {
    return this._HttpClient.get(
      `${this.API_URL}/api/v1/user/getUserById/${id}`
    );
  }

  updateUser(id: string, user: object): Observable<any> {
    return this._HttpClient.put(
      `${this.API_URL}/api/v1/user/updateUser/${id}`,
      user
    );
  }

  deleteUser(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${this.API_URL}/api/v1/user/deleteUser/${id}`
    );
  }
}
