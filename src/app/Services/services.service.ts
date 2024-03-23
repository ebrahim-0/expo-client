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

  getPavilionByCountry(country: string): Observable<any> {
    return this._HttpClient.get(
      `${this.API_URL}/api/v1/user/getPavilionByCountry/${country}`
    );
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

  addPavilionsReviews(path: string, review: object): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/user/addPavilionReview/${path}`,
      review
    );
  }

  getPavilionReviews(country: string): Observable<any> {
    return this._HttpClient.get(
      `${this.API_URL}/api/v1/user/getAllPavilionReview/${country}`
    );
  }

  addFacility(facility: object): Observable<any> {
    return this._HttpClient.post(
      `${this.API_URL}/api/v1/user/addFacility`,
      facility
    );
  }

  getAllFacilities(): Observable<any> {
    return this._HttpClient.get(`${this.API_URL}/api/v1/user/getAllFacilities`);
  }

  deleteFacility(id: string): Observable<any> {
    return this._HttpClient.delete(
      `${this.API_URL}/api/v1/user/deleteFacility/${id}`
    );
  }

  updateFacility(id: string, facility: object): Observable<any> {
    return this._HttpClient.put(
      `${this.API_URL}/api/v1/user/updateFacility/${id}`,
      facility
    );
  }
}
