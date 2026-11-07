import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PriceEstimate, RideRequest, RideResponse } from '../models/ride.model';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = `${environment.apiUrl}/rides`;

  constructor(private http: HttpClient) {}

  estimatePrice(data: any): Observable<PriceEstimate> {
    return this.http.post<PriceEstimate>(`${this.apiUrl}/estimate`, data);
  }

  requestRide(data: RideRequest): Observable<RideResponse> {
    return this.http.post<RideResponse>(this.apiUrl, data);
  }

  getRideById(id: number): Observable<RideResponse> {
    return this.http.get<RideResponse>(`${this.apiUrl}/${id}`);
  }

  acceptRide(id: number, driverId: number): Observable<RideResponse> {
    return this.http.put<RideResponse>(`${this.apiUrl}/${id}/accept?driverId=${driverId}`, {});
  }

  startRide(id: number): Observable<RideResponse> {
    return this.http.put<RideResponse>(`${this.apiUrl}/${id}/start`, {});
  }

  completeRide(id: number): Observable<RideResponse> {
    return this.http.put<RideResponse>(`${this.apiUrl}/${id}/complete`, {});
  }

  cancelRide(id: number): Observable<RideResponse> {
    return this.http.put<RideResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getCustomerRides(customerId: number): Observable<RideResponse[]> {
    return this.http.get<RideResponse[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getDriverRides(driverId: number): Observable<RideResponse[]> {
    return this.http.get<RideResponse[]>(`${this.apiUrl}/driver/${driverId}`);
  }

  getAdminRides(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/rides?size=25`);
  }
}
