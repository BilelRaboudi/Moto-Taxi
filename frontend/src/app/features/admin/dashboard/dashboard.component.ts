import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../../core/services/driver.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    activeRides: 18,
    onlineDrivers: 142,
    revenueToday: 2450
  };

  pendingDrivers: any[] = [];
  isLoading = false;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadPendingDrivers();
  }

  loadStats(): void {
    this.driverService.getAdminStats().subscribe({
      next: (data) => {
        if (data) {
          this.stats.activeRides = data.activeRides !== undefined ? data.activeRides : 18;
          this.stats.onlineDrivers = data.onlineDrivers !== undefined ? data.onlineDrivers : 142;
          this.stats.revenueToday = data.revenueToday !== undefined ? data.revenueToday : 2450;
        }
      },
      error: () => {}
    });
  }

  loadPendingDrivers(): void {
    this.driverService.getPendingDrivers().subscribe({
      next: (drivers) => {
        if (drivers && drivers.length > 0) {
          this.pendingDrivers = drivers.map((d: any) => ({
            id: d.id,
            name: (d.user?.firstName || 'Chauffeur') + ' ' + (d.user?.lastName || ''),
            time: '10:45',
            phone: d.user?.phone || '+216 98 123 456',
            date: '07/11/2026',
            rating: 4.8,
            status: d.status || 'PENDING'
          }));
        } else {
          // Fallback initial visual data
          this.pendingDrivers = [
            { id: 1, name: 'Mohamed Ben Ali', time: '10:45', phone: '+216 98 123 456', date: '07/11/2026', rating: 4.8, status: 'PENDING' },
            { id: 2, name: 'Leila Trabelsi', time: '10:41', phone: '+216 92 887 654', date: '07/11/2026', rating: 4.9, status: 'PENDING' },
            { id: 3, name: 'Ahmed Hamdi', time: '10:43', phone: '+216 95 121 788', date: '07/11/2026', rating: 4.7, status: 'PENDING' }
          ];
        }
      },
      error: () => {}
    });
  }

  validateDriver(driver: any): void {
    driver.status = 'VALIDATED';
    this.driverService.validateDriver(driver.id).subscribe({
      next: () => {
        this.loadStats();
      },
      error: () => {}
    });
  }

  refuseDriver(driver: any): void {
    driver.status = 'REFUSED';
    this.driverService.refuseDriver(driver.id).subscribe({
      next: () => {
        this.loadStats();
      },
      error: () => {}
    });
  }
}
