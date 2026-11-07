import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent {
  constructor(public authService: AuthService, private router: Router) {}

  switchRole(role: string) {
    if (role === 'client') {
      const u = this.authService.currentUser();
      if (u) {
        u.role = 'CUSTOMER';
        localStorage.setItem('mototaxi_user', JSON.stringify(u));
        this.authService.currentUser.set(u);
      }
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
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
