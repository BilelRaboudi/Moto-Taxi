import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-black text-gray-900">Gestion des utilisateurs</h2>
        <p class="text-xs text-gray-500">Clients, Chauffeurs et Administrateurs</p>
      </div>

      <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-100 uppercase text-gray-400 bg-gray-50 font-extrabold text-[11px]">
                <th class="py-3.5 px-6">Nom</th>
                <th class="py-3.5 px-6">Email</th>
                <th class="py-3.5 px-6">Rôle</th>
                <th class="py-3.5 px-6">Téléphone</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let u of users" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-bold text-gray-900">{{ u.name }}</td>
                <td class="py-4 px-6 text-gray-600">{{ u.email }}</td>
                <td class="py-4 px-6">
                  <span [class]="u.roleClass" class="font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                    {{ u.role }}
                  </span>
                </td>
                <td class="py-4 px-6 font-semibold text-gray-700">{{ u.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AccountsComponent {
  users = [
    { name: 'Admin MotoTaxi', email: 'admin@mototaxi.tn', role: 'ADMIN', roleClass: 'bg-purple-100 text-purple-700', phone: '+216 71 000 000' },
    { name: 'Sami Ben Salah', email: 'client@mototaxi.tn', role: 'CUSTOMER', roleClass: 'bg-blue-100 text-blue-700', phone: '+216 98 123 456' },
    { name: 'Mohamed Ben Ali', email: 'driver@mototaxi.tn', role: 'DRIVER', roleClass: 'bg-yellow-100 text-yellow-800', phone: '+216 98 123 456' }
  ];
}
