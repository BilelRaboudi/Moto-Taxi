import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  roleClass: string;
  phone: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-black text-gray-900">Gestion des utilisateurs</h2>
          <p class="text-xs text-gray-500">Clients, Chauffeurs et Administrateurs</p>
        </div>
        <span class="text-xs font-bold text-gray-400">{{ users.length }} utilisateur(s)</span>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="flex items-center justify-center py-16">
        <div class="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span class="ml-3 text-sm text-gray-500">Chargement des utilisateurs...</span>
      </div>

      <!-- Error -->
      <div *ngIf="error && !loading" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600 font-semibold text-sm">{{ error }}</p>
        <button (click)="loadUsers()" class="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold hover:bg-red-200">
          Réessayer
        </button>
      </div>

      <!-- Table -->
      <div *ngIf="!loading && !error" class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-gray-100 uppercase text-gray-400 bg-gray-50 font-extrabold text-[11px]">
                <th class="py-3.5 px-6">Nom</th>
                <th class="py-3.5 px-6">Email</th>
                <th class="py-3.5 px-6">Rôle</th>
                <th class="py-3.5 px-6">Téléphone</th>
                <th class="py-3.5 px-6">Inscrit le</th>
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
                <td class="py-4 px-6 font-semibold text-gray-700">{{ u.phone || '—' }}</td>
                <td class="py-4 px-6 text-gray-400">{{ u.createdAt }}</td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="5" class="py-12 text-center text-gray-400 text-sm">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AccountsComponent implements OnInit {
  users: UserRow[] = [];
  loading = false;
  error: string | null = null;

  private readonly ROLE_CLASSES: Record<string, string> = {
    CUSTOMER: 'bg-blue-100 text-blue-700',
    DRIVER:   'bg-yellow-100 text-yellow-800',
    ADMIN:    'bg-purple-100 text-purple-700'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Charger toutes les pages (page=0, size=200 pour tout récupérer en une requête)
    this.http.get<any>(`${environment.apiUrl}/admin/users?page=0&size=200`, { headers }).subscribe({
      next: (response) => {
        const content = response?.content ?? response ?? [];
        this.users = (Array.isArray(content) ? content : []).map((u: any) => ({
          id: u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Inconnu',
          email: u.email,
          role: u.role,
          roleClass: this.ROLE_CLASSES[u.role] ?? 'bg-gray-100 text-gray-700',
          phone: u.phone,
          createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-TN') : '—'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.error = 'Impossible de charger les utilisateurs. Vérifiez que le serveur est démarré.';
        this.loading = false;
      }
    });
  }
}
