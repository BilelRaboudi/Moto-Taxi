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

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
