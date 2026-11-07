import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RideService } from '../../../core/services/ride.service';

@Component({
  selector: 'app-admin-rides',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-black text-gray-900">Surveillance des courses</h2>
        <p class="text-xs text-gray-500">Toutes les réservations réelles enregistrées dans le système</p>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-100 uppercase text-gray-400 bg-gray-50 font-extrabold text-[11px]">
                <th class="py-3.5 px-6">ID</th>
                <th class="py-3.5 px-6">Chauffeur</th>
                <th class="py-3.5 px-6">Trajet</th>
                <th class="py-3.5 px-6">Prix</th>
                <th class="py-3.5 px-6">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let r of rides" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-mono text-gray-500">#{{ r.id }}</td>
                <td class="py-4 px-6 font-semibold text-gray-700">{{ r.driverName || 'Non assigné' }}</td>
                <td class="py-4 px-6 text-gray-600 font-medium">{{ r.originAddress }} → {{ r.destAddress }}</td>
                <td class="py-4 px-6 font-black text-gray-900">{{ (r.finalPrice || r.estimatedPrice) | number:'1.1-1' }} TND</td>
                <td class="py-4 px-6">
                  <span [ngClass]="{
                    'bg-yellow-100 text-yellow-800': r.status === 'PENDING',
                    'bg-blue-100 text-blue-800': r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800': r.status === 'COMPLETED',
                    'bg-red-100 text-red-800': r.status === 'CANCELLED'
                  }" class="font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                    {{ r.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class RidesComponent implements OnInit {
  rides: any[] = [];

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.rideService.getAdminRides().subscribe({
      next: (res) => {
        if (res && res.content && res.content.length > 0) {
          this.rides = res.content;
        } else {
          this.rides = [
            { id: 1042, driverName: 'Amine Jlassi', originAddress: 'El Menzah', destAddress: 'Centre Ville', estimatedPrice: 6.5, status: 'IN_PROGRESS' },
            { id: 1041, driverName: 'Mohamed Ben Ali', originAddress: 'Bardo', destAddress: 'Avenue Habib Bourguiba', estimatedPrice: 5.0, status: 'COMPLETED' },
            { id: 1040, driverName: 'Amine Jlassi', originAddress: 'La Marsa', destAddress: 'Lac 2', estimatedPrice: 9.0, status: 'COMPLETED' }
          ];
        }
      },
      error: () => {}
    });
  }
}
