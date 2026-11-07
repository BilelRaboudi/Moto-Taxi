import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-requests',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <h3 class="text-sm font-black text-gray-900 mb-2">Demandes de courses à proximité</h3>
      <div class="bg-white rounded-3xl p-5 shadow-md border-2 border-yellow-300 space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <span class="text-[11px] font-extrabold uppercase text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
              À 400m de vous
            </span>
            <h4 class="text-sm font-bold text-gray-900 mt-2">Ennasr 2 → Manar 1</h4>
            <p class="text-xs text-gray-400">Distance : 3.2 km (~8 min)</p>
          </div>
          <span class="text-lg font-black text-[#1A1A1A]">5,5 TND</span>
        </div>

        <div class="flex gap-2 pt-2 border-t border-gray-100">
          <button class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition">
            Passer
          </button>
          <button class="flex-1 py-2 bg-[#F5C518] text-[#1A1A1A] rounded-xl text-xs font-black shadow-md hover:bg-[#E5B50A] transition">
            Accepter (12s)
          </button>
        </div>
      </div>
    </div>
  `
})
export class RequestsComponent {}
