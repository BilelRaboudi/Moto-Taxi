import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RideService } from '../../../core/services/ride.service';
import { VehicleType } from '../../../core/models/ride.model';

declare let L: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  map: any;
  destinationQuery = '';
  selectedVehicle: VehicleType = 'MOTO';
  estimatedPrice: number = 5.0;
  isEstimating = false;

  origin = { address: 'El Menzah, Tunis', lat: 36.8345, lng: 10.1800 };
  destination = { address: 'Avenue Habib Bourguiba, Centre Ville', lat: 36.8008, lng: 10.1865 };

  recentTrips = [
    { name: 'Avenue Habib Bourguiba', subtext: 'Centre Ville', price: '5 - 8 TND', lat: 36.8008, lng: 10.1865 },
    { name: 'La Marsa', subtext: 'Plage & Ville', price: '8 - 12 TND', lat: 36.8782, lng: 10.3247 }
  ];

  constructor(private rideService: RideService, private router: Router) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.fetchEstimate();
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    if (typeof L === 'undefined') {
      setTimeout(() => this.initMap(), 250);
      return;
    }

    if (this.map) return;

    const mapElement = document.getElementById('clientMap');
    if (!mapElement) return;

    this.map = L.map('clientMap', {
      zoomControl: false,
      attributionControl: false
    }).setView([36.8150, 10.1800], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      this.map?.invalidateSize();
    }, 300);

    const motoIcon = L.divIcon({
      className: 'custom-moto-marker',
      html: `
        <div style="background: #F5C518; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid white;">
          <i class="fa-solid fa-location-arrow" style="color: #1A1A1A; font-size: 14px; transform: rotate(45deg);"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: `
        <div style="background: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 2px solid #1A1A1A;">
          <i class="fa-solid fa-location-dot" style="color: #1A1A1A; font-size: 13px;"></i>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    L.marker([36.8180, 10.1750], { icon: motoIcon }).addTo(this.map);
    L.marker([36.8008, 10.1865], { icon: destIcon }).addTo(this.map);
    L.marker([36.8345, 10.1800], { icon: destIcon }).addTo(this.map);
  }

  fetchEstimate() {
    this.rideService.estimatePrice({
      originLat: this.origin.lat,
      originLng: this.origin.lng,
      destLat: this.destination.lat,
      destLng: this.destination.lng,
      vehicleType: this.selectedVehicle
    }).subscribe({
      next: (est) => {
        if (est && est.estimatedPrice) {
          this.estimatedPrice = est.estimatedPrice;
        }
      },
      error: () => {}
    });
  }

  selectVehicle(type: VehicleType) {
    this.selectedVehicle = type;
    this.fetchEstimate();
  }

  selectRecent(trip: any) {
    this.destinationQuery = trip.name;
    this.destination = { address: trip.name, lat: trip.lat, lng: trip.lng };
    this.fetchEstimate();
  }

  confirmBooking() {
    this.isEstimating = true;
    const req = {
      originAddress: this.origin.address,
      originLat: this.origin.lat,
      originLng: this.origin.lng,
      destAddress: this.destinationQuery || this.destination.address,
      destLat: this.destination.lat,
      destLng: this.destination.lng,
      vehicleType: this.selectedVehicle
    };

    this.rideService.requestRide(req).subscribe({
      next: (ride) => {
        this.isEstimating = false;
        this.router.navigate(['/client/tracking', ride.id]);
      },
      error: () => {
        this.isEstimating = false;
        this.router.navigate(['/client/tracking', 101]);
      }
    });
  }
}
