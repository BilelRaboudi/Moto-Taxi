import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  /** Pre-fill credentials for quick demo testing */
  autofill(role: string) {
    if (role === 'client') {
      this.loginForm.patchValue({ email: 'client@mototaxi.tn', password: 'Client@123' });
    } else if (role === 'driver') {
      this.loginForm.patchValue({ email: 'driver@mototaxi.tn', password: 'Driver@123' });
    } else if (role === 'admin') {
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
        // Redirect based on the role returned by the server
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
