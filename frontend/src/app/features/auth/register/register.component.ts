import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role } from '../../../core/models/user.model';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, LogoComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedRole: 'CUSTOMER' | 'DRIVER' = 'CUSTOMER';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      licenseNumber: [''],
      vehicleType: ['MOTO'],
      vehiclePlate: ['']
    });
  }

  selectRole(role: 'CUSTOMER' | 'DRIVER') {
    this.selectedRole = role;
    if (role === 'DRIVER') {
      this.registerForm.get('licenseNumber')?.setValidators([Validators.required]);
      this.registerForm.get('vehiclePlate')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('licenseNumber')?.clearValidators();
      this.registerForm.get('vehiclePlate')?.clearValidators();
    }
    this.registerForm.get('licenseNumber')?.updateValueAndValidity();
    this.registerForm.get('vehiclePlate')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedRole === 'CUSTOMER') {
      const data = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        role: 'CUSTOMER' as Role
      };
      this.authService.register(data).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/client']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l’inscription.';
        }
      });
    } else {
      this.authService.registerDriver(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/driver']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l’inscription chauffeur.';
        }
      });
    }
  }
}
