import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-driver-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-shell.component.html',
  styleUrls: ['./driver-shell.component.scss']
})
export class DriverShellComponent {
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
