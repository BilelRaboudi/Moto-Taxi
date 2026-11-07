import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RideService } from '../../../core/services/ride.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-5">
      <h2 class="text-lg font-black text-gray-900 mb-4">Historique des courses</h2>
      
      <div class="space-y-3">
        <div *ngFor="let ride of rides" class="bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow transition">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-400 font-medium">{{ ride.date }}</span>
            <span class="text-xs font-black text-[#1A1A1A] bg-[#F5C518] px-2.5 py-0.5 rounded-full">
              {{ ride.price }} TND
            </span>
          </div>

          <div class="space-y-1.5 text-xs">
            <div class="flex items-center gap-2 text-gray-600">
              <i class="fa-solid fa-circle text-[8px] text-gray-400"></i>
              <span>{{ ride.origin }}</span>
            </div>
            <div class="flex items-center gap-2 font-bold text-gray-900">
              <i class="fa-solid fa-location-dot text-xs text-[#F5C518]"></i>
              <span>{{ ride.destination }}</span>
            </div>
          </div>

          <div class="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-500">
            <span>Chauffeur : <strong>{{ ride.driver }}</strong></span>
            <span class="text-green-600 font-bold"><i class="fa-solid fa-check-circle mr-1"></i>Terminée</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  rides = [
    { date: 'Aujourd’hui à 11:20', origin: 'El Menzah', destination: 'Centre Ville', price: 6.5, driver: 'Mohamed Ben Ali' },
    { date: 'Hier à 18:45', origin: 'La Marsa', destination: 'Lac 2', price: 9.0, driver: 'Sami Khemir' },
    { date: '04 Nov à 08:30', origin: 'Bardo', destination: 'Avenue Habib Bourguiba', price: 5.0, driver: 'Amine Jlassi' }
  ];

  constructor(private rideService: RideService, private authService: AuthService) {}

  ngOnInit(): void {}
}
