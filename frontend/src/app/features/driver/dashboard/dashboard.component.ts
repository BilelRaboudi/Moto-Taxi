import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../core/services/socket.service';
import { DriverService } from '../../../core/services/driver.service';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  driverId: number = 1;
  todayEarnings: number = 87.5;
  todayRidesCount: number = 15;
  driverRating: number = 4.9;
  isOnline: boolean = true;

  hasNewRequest: boolean = true;
  incomingRequest = {
    rideId: 102,
    origin: 'El Menzah',
    destination: 'Centre Ville',
    price: 6.5
  };

  recentTrips: any[] = [
    { time: '14:32', origin: 'El Menzah', destination: 'Centre Ville', price: 6.5 },
    { time: '13:15', origin: 'Lac 1', destination: 'Centre Urbain Nord', price: 8.0 }
  ];

  constructor(
    private socketService: SocketService,
    private driverService: DriverService,
    private rideService: RideService
  ) {}

  ngOnInit(): void {
    this.loadDriverData();
    this.initSocketListener();
  }

  loadDriverData(): void {
    this.driverService.getDriverDashboardStats(this.driverId).subscribe({
      next: (stats) => {
        if (stats) {
          this.todayEarnings = stats.todayEarnings || this.todayEarnings;
          this.todayRidesCount = stats.todayRidesCount || this.todayRidesCount;
          this.driverRating = stats.driverRating || this.driverRating;
          this.isOnline = stats.isAvailable !== undefined ? stats.isAvailable : true;
          
          if (stats.recentTrips && stats.recentTrips.length > 0) {
            this.recentTrips = stats.recentTrips.map((r: any) => ({
              time: r.requestedAt ? new Date(r.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '14:32',
              origin: r.originAddress,
              destination: r.destAddress,
              price: r.finalPrice || r.estimatedPrice
            }));
          }
        }
      },
      error: () => {}
    });
  }

  initSocketListener(): void {
    this.socketService.connect();
    this.socketService.listen<any>('ride:incomingRequest').subscribe((req) => {
      this.hasNewRequest = true;
      this.incomingRequest = {
        rideId: req.rideId,
        origin: req.originAddress || 'Nouvelle position',
        destination: req.destAddress || 'Destination',
        price: req.price || 6.5
      };
    });
  }

  acceptRequest(): void {
    this.hasNewRequest = false;
    this.todayRidesCount++;
    this.todayEarnings += this.incomingRequest.price;

    this.rideService.acceptRide(this.incomingRequest.rideId, this.driverId).subscribe({
      next: () => {
        this.loadDriverData();
      },
      error: () => {}
    });

    this.socketService.emit('ride:accepted', {
      rideId: this.incomingRequest.rideId,
      driverId: this.driverId
    });
  }

  ignoreRequest(): void {
    this.hasNewRequest = false;
    this.socketService.emit('ride:rejected', {
      rideId: this.incomingRequest.rideId,
      driverId: this.driverId
    });
  }
}
