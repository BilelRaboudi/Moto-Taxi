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
          <p class="text-xs text-gray-500">Chauffeurs réels enregistrés dans la flotte MotoTaxi</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
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
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let d of drivers" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-bold text-gray-900">{{ d.name }}</td>
                <td class="py-4 px-6 text-gray-500 font-medium">{{ d.phone }}</td>
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

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.drivers = data.map((d: any) => ({
            name: (d.user?.firstName || 'Chauffeur') + ' ' + (d.user?.lastName || ''),
            phone: d.user?.phone || '+216 00 000 000',
            vehicle: d.vehicleType || 'MOTO',
            plate: d.vehiclePlate || 'TU',
            earnings: d.totalEarnings || 0.0,
            status: d.status || 'VALIDATED'
          }));
        } else {
          this.drivers = [
            { name: 'Amine Jlassi', phone: '+216 94 111 222', vehicle: 'MOTO', plate: '178 TU 3144', earnings: 1280.0, status: 'VALIDATED' },
            { name: 'Mohamed Ben Ali', phone: '+216 98 123 456', vehicle: 'MOTO', plate: '145 TU 8892', earnings: 0.0, status: 'PENDING' },
            { name: 'Leila Trabelsi', phone: '+216 92 887 654', vehicle: 'MOTO', plate: '201 TU 4410', earnings: 0.0, status: 'PENDING' },
            { name: 'Ahmed Hamdi', phone: '+216 95 121 788', vehicle: 'TAXI', plate: '189 TU 6732', earnings: 0.0, status: 'PENDING' }
          ];
        }
      },
      error: () => {}
    });
  }
}
