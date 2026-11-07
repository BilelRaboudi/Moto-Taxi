import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-earnings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 text-center">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Total cette semaine</span>
        <h2 class="text-3xl font-black text-gray-900 mt-1">482,50 <span class="text-sm font-bold text-gray-500">TND</span></h2>
        <div class="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-bold mt-2">
          <i class="fa-solid fa-arrow-trend-up"></i>
          <span>+14.2% vs semaine passée</span>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <h3 class="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Détail par jour</h3>
        <div class="space-y-2 text-xs">
          <div class="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span class="font-bold text-gray-700">Aujourd'hui (Samedi)</span>
            <span class="font-black text-gray-900">87,5 TND (15 courses)</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span class="font-medium text-gray-600">Vendredi</span>
            <span class="font-bold text-gray-800">112,0 TND (18 courses)</span>
          </div>
          <div class="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span class="font-medium text-gray-600">Jeudi</span>
            <span class="font-bold text-gray-800">95,0 TND (16 courses)</span>
          </div>
          <div class="flex justify-between items-center py-1.5">
            <span class="font-medium text-gray-600">Mercredi</span>
            <span class="font-bold text-gray-800">104,0 TND (17 courses)</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EarningsComponent {}
