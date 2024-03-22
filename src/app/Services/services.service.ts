import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject('API_URL') private API_URL: string
  ) {}

  getAllPavilions(): Observable<any> {
    return this._HttpClient.get(`${this.API_URL}/api/v1/user/getAllPavilions`);
  }

  addPavilion(pavilion: object): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/user/addPavilion`,
      pavilion
    );
  }

  updatePavilion(id: string, pavilion: object): Observable<any> {
    return this._HttpClient.put(
      `${this.API_URL}/api/v1/user/updatePavilion/${id}`,
      pavilion
    );
  }

  deletePavilion(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${this.API_URL}/api/v1/user/deletePavilion/${id}`
    );
  }
}
