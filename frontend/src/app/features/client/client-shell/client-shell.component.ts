import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-client-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './client-shell.component.html',
  styleUrls: ['./client-shell.component.scss']
})
export class ClientShellComponent {
  constructor(public authService: AuthService, private router: Router) {}

  switchRole(role: string) {
    if (role === 'client') {
      this.router.navigate(['/client/home']);
    } else if (role === 'driver') {
      const u = this.authService.currentUser();
      if (u) {
        u.role = 'DRIVER';
        localStorage.setItem('mototaxi_user', JSON.stringify(u));
        this.authService.currentUser.set(u);
      }
      this.router.navigate(['/driver/dashboard']);
    } else if (role === 'admin') {
      const u = this.authService.currentUser();
      if (u) {
        u.role = 'ADMIN';
        localStorage.setItem('mototaxi_user', JSON.stringify(u));
        this.authService.currentUser.set(u);
      }
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
