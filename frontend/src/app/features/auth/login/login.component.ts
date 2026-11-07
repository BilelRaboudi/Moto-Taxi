import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  selectedRole: Role = 'CUSTOMER';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['client@mototaxi.tn', [Validators.required, Validators.email]],
      password: ['Client@123', [Validators.required]]
    });
  }

  selectRole(role: Role) {
    this.selectedRole = role;
    if (role === 'CUSTOMER') {
      this.loginForm.patchValue({ email: 'client@mototaxi.tn', password: 'Client@123' });
    } else if (role === 'DRIVER') {
      this.loginForm.patchValue({ email: 'driver@mototaxi.tn', password: 'Driver@123' });
    } else if (role === 'ADMIN') {
      this.loginForm.patchValue({ email: 'admin@mototaxi.tn', password: 'Admin@123' });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.role === 'CUSTOMER') {
          this.router.navigate(['/client']);
        } else if (res.role === 'DRIVER') {
          this.router.navigate(['/driver']);
        } else if (res.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }
}
