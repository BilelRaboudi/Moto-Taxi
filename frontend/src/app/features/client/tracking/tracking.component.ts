import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SocketService } from '../../../core/services/socket.service';

declare let L: any;

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, OnDestroy {
  map: any;
  driverMarker: any;
  rideId: number = 101;
  statusText = 'Chauffeur en route...';
  etaMinutes = 4;
  driverName = 'Mohamed Ben Ali';
  vehiclePlate = '145 TU 8892';
  vehicleType = 'Yamaha TMAX (Moto)';
  rating = 4.9;
  sosTriggered = false;

  constructor(private route: ActivatedRoute, private socketService: SocketService) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) this.rideId = +param;

    this.socketService.connect();
    this.socketService.listen<any>('driver:locationUpdated').subscribe((loc) => {
      if (this.driverMarker && loc.lat && loc.lng) {
        this.driverMarker.setLatLng([loc.lat, loc.lng]);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  private initMap(): void {
    if (typeof L === 'undefined') return;

    this.map = L.map('trackingMap', {
      zoomControl: false,
      attributionControl: false
    }).setView([36.8150, 10.1800], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(this.map);

    const motoIcon = L.divIcon({
      className: 'live-moto-marker',
      html: `
        <div style="background: #F5C518; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 3px solid white;">
          <i class="fa-solid fa-motorcycle" style="color: #111; font-size: 16px;"></i>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    this.driverMarker = L.marker([36.8120, 10.1810], { icon: motoIcon }).addTo(this.map);
  }

  triggerSOS() {
    this.sosTriggered = true;
    this.socketService.emit('customer:sos', {
      rideId: this.rideId,
      customerId: 1,
      lat: 36.8150,
      lng: 10.1800,
      timestamp: new Date()
    });
  }
}
