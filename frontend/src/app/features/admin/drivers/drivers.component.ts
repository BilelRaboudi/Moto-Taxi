import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverService } from '../../../core/services/driver.service';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-black text-gray-900">Gestion des chauffeurs</h2>
          <p class="text-xs text-gray-500">Chauffeurs enregistrés dans la flotte MotoTaxi</p>
        </div>
        <span class="text-xs font-bold text-gray-400">{{ drivers.length }} chauffeur(s)</span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex items-center justify-center py-16">
        <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="ml-3 text-sm text-gray-500">Chargement des chauffeurs...</span>
      </div>

      <!-- Error -->
      <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600 font-semibold text-sm">{{ error }}</p>
        <button (click)="loadDrivers()" class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200">
          Réessayer
        </button>
      </div>

      <!-- Table -->
      <div *ngIf="!loading && !error" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-100 uppercase text-gray-400 bg-gray-50 font-extrabold text-[11px]">
                <th class="py-3 px-6">Chauffeur</th>
                <th class="py-3 px-6">Téléphone</th>
                <th class="py-3 px-6">Véhicule</th>
                <th class="py-3 px-6">Matricule</th>
                <th class="py-3 px-6">Gains Totaux</th>
                <th class="py-3 px-6">Statut</th>
                <th class="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let d of drivers" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-bold text-gray-900">{{ d.name }}</td>
                <td class="py-4 px-6 text-gray-500 font-medium">{{ d.phone || '—' }}</td>
                <td class="py-4 px-6 text-gray-600">{{ d.vehicle }}</td>
                <td class="py-4 px-6 font-mono text-gray-700">{{ d.plate }}</td>
                <td class="py-4 px-6 font-bold text-gray-900">{{ d.earnings | number:'1.1-1' }} TND</td>
                <td class="py-4 px-6">
                  <span [ngClass]="{
                    'bg-green-100 text-green-700': d.status === 'VALIDATED',
                    'bg-yellow-100 text-yellow-700': d.status === 'PENDING',
                    'bg-red-100 text-red-700': d.status === 'REFUSED'
                  }" class="font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                    {{ d.status === 'VALIDATED' ? 'Validé' : (d.status === 'PENDING' ? 'En attente' : 'Refusé') }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex gap-2" *ngIf="d.status === 'PENDING'">
                    <button (click)="validate(d)" class="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-200">
                      ✓ Valider
                    </button>
                    <button (click)="refuse(d)" class="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[10px] font-bold hover:bg-red-200">
                      ✗ Refuser
                    </button>
                  </div>
                  <span *ngIf="d.status !== 'PENDING'" class="text-gray-300 text-[10px]">—</span>
                </td>
              </tr>
              <tr *ngIf="drivers.length === 0">
                <td colspan="7" class="py-12 text-center text-gray-400 text-sm">
                  Aucun chauffeur trouvé.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DriversComponent implements OnInit {
  drivers: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.error = null;

    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = (data || []).map((d: any) => ({
          id: d.id,
          name: `${d.user?.firstName || 'Chauffeur'} ${d.user?.lastName || ''}`.trim(),
          phone: d.user?.phone,
          vehicle: d.vehicleType || 'MOTO',
          plate: d.vehiclePlate || '—',
          earnings: d.totalEarnings ?? 0.0,
          status: d.status || 'PENDING'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement chauffeurs:', err);
        this.error = 'Impossible de charger les chauffeurs. Vérifiez que le serveur est démarré.';
        this.loading = false;
      }
    });
  }

  validate(d: any): void {
    this.driverService.validateDriver(d.id).subscribe({
      next: () => { d.status = 'VALIDATED'; },
      error: (err) => console.error('Erreur validation:', err)
    });
  }

  refuse(d: any): void {
    this.driverService.refuseDriver(d.id).subscribe({
      next: () => { d.status = 'REFUSED'; },
      error: (err) => console.error('Erreur refus:', err)
    });
  }
}
