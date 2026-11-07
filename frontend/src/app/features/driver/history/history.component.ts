import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3">
      <h3 class="text-sm font-black text-gray-900 mb-2">Historique de mes courses</h3>
      <div *ngFor="let item of rides" class="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 space-y-1 text-xs">
        <div class="flex justify-between items-center">
          <span class="text-gray-400 font-semibold">{{ item.time }}</span>
          <span class="font-black text-[#1A1A1A] bg-[#F5C518] px-2 py-0.5 rounded-md">{{ item.price }} TND</span>
        </div>
        <div class="font-bold text-gray-800">
          {{ item.origin }} <i class="fa-solid fa-arrow-right text-[10px] text-gray-400 mx-1"></i> {{ item.destination }}
        </div>
        <div class="text-[11px] text-gray-500 flex justify-between pt-1 border-t border-gray-50">
          <span>Client: {{ item.client }}</span>
          <span class="text-green-600 font-bold">Encaissé (Espèces)</span>
        </div>
      </div>
    </div>
  `
})
export class HistoryComponent {
  rides = [
    { time: '14:32 Aujourd\'hui', origin: 'El Menzah', destination: 'Centre Ville', price: 6.5, client: 'Karim D.' },
    { time: '13:15 Aujourd\'hui', origin: 'Lac 1', destination: 'Centre Urbain Nord', price: 8.0, client: 'Nadia S.' },
    { time: '11:40 Aujourd\'hui', origin: 'Menzah 9', destination: 'Ariana', price: 5.0, client: 'Youssef B.' }
  ];
}
