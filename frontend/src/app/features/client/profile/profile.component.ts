import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="flex flex-col items-center mb-6">
        <div class="w-20 h-20 rounded-full bg-[#1A1A1A] text-[#F5C518] flex items-center justify-center text-2xl font-black mb-3 shadow-md">
          {{ userInitials }}
        </div>
        <h2 class="text-base font-black text-gray-900">{{ userName }}</h2>
        <p class="text-xs text-gray-500">{{ userEmail }}</p>
        <span class="mt-2 text-[10px] font-extrabold uppercase bg-yellow-100 text-[#B78A00] px-3 py-1 rounded-full">
          Client Vérifié
        </span>
      </div>

      <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 text-xs mb-6">
        <div class="flex justify-between items-center py-1 border-b border-gray-200">
          <span class="text-gray-500 font-medium">Téléphone</span>
          <span class="font-bold text-gray-800">+216 98 123 456</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-gray-200">
          <span class="text-gray-500 font-medium">Mode de paiement</span>
          <span class="font-bold text-gray-800">Espèces / D17</span>
        </div>
        <div class="flex justify-between items-center py-1">
          <span class="text-gray-500 font-medium">Langue</span>
          <span class="font-bold text-gray-800">Français / عربي</span>
        </div>
      </div>

      <button (click)="logout()" class="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
        <span>Déconnexion</span>
      </button>
    </div>
  `
})
export class ProfileComponent {
  userName = 'Sami Ben Salah';
  userEmail = 'client@mototaxi.tn';
  userInitials = 'SB';

  constructor(private authService: AuthService) {
    const user = this.authService.currentUser();
    if (user && user.fullName) {
      this.userName = user.fullName;
      const parts = user.fullName.split(' ');
      this.userInitials = parts.map(p => p[0]).join('').toUpperCase();
    }
  }

  logout() {
    this.authService.logout();
  }
}
