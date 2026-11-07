import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-tariffs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-black text-gray-900">Gestion des Tarifs</h2>
        <p class="text-xs text-gray-500">Ajustez le prix de base et le tarif au kilomètre par véhicule</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let t of tariffs" class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-yellow-50 text-[#1A1A1A] flex items-center justify-center text-xl mb-4">
              <i [class]="t.icon"></i>
            </div>
            <h3 class="text-base font-extrabold text-gray-900">{{ t.label }}</h3>
            <p class="text-xs text-gray-400 mb-4">{{ t.desc }}</p>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">Prix de base (TND)</label>
                <input type="number" [(ngModel)]="t.basePrice" class="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase">Tarif au km (TND)</label>
                <input type="number" [(ngModel)]="t.pricePerKm" class="w-full mt-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900">
              </div>
            </div>
          </div>

          <button (click)="saveTariff(t)" class="mt-6 w-full py-2.5 bg-[#F5C518] hover:bg-[#E5B50A] text-[#1A1A1A] font-bold rounded-xl text-xs transition shadow-sm">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  `
})
export class TariffsComponent {
  tariffs = [
    { type: 'MOTO', label: 'Moto Standard', desc: 'Déplacements urbains rapides', basePrice: 2.0, pricePerKm: 0.8, icon: 'fa-solid fa-motorcycle' },
    { type: 'TAXI', label: 'Taxi Grand Confort', desc: 'Maxi scooter & berline moto', basePrice: 3.5, pricePerKm: 1.2, icon: 'fa-solid fa-taxi' },
    { type: 'EXPRESS', label: 'Express / Colis', desc: 'Livraison express urgente', basePrice: 5.0, pricePerKm: 1.8, icon: 'fa-solid fa-truck-fast' }
  ];

  saveTariff(t: any) {
    alert(`Tarif mis à jour pour ${t.label} : ${t.basePrice} TND base + ${t.pricePerKm} TND/km`);
  }
}
