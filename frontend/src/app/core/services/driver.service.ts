import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = `${environment.apiUrl}/drivers`;
  private adminUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDriverById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/${id}`);
  }

  getDriverByUserId(userId: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/user/${userId}`);
  }

  setAvailability(id: number, available: boolean): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}/availability`, { available });
  }

  getEarnings(id: number): Observable<{ totalEarnings: number }> {
    return this.http.get<{ totalEarnings: number }>(`${this.apiUrl}/${id}/earnings`);
  }

  getDriverDashboardStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/dashboard-stats`);
  }

  updateLocation(id: number, lat: number, lng: number): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${id}/location`, { lat, lng });
  }

  // Admin endpoints
  getPendingDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.adminUrl}/drivers/pending`);
  }

  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.adminUrl}/drivers`);
  }

  validateDriver(id: number): Observable<Driver> {
    return this.http.put<Driver>(`${this.adminUrl}/drivers/${id}/validate`, {});
  }

  refuseDriver(id: number): Observable<Driver> {
    return this.http.put<Driver>(`${this.adminUrl}/drivers/${id}/refuse`, {});
  }

  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/stats`);
  }
}
