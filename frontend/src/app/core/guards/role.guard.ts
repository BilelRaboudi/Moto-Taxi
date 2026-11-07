import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    // Allow seamless access to all 3 role interfaces
    if (authService.isLoggedIn()) {
      return true;
    }
    const router = inject(Router);
    router.navigate(['/auth/login']);
    return false;
  };
};
