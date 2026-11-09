import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/user.model';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/auth/login']);
      return false;
    }

    const userRole = authService.currentUser()?.role;
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Role non autorise -> redirection vers l'espace legitime de l'utilisateur
    if (userRole === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else if (userRole === 'DRIVER') {
      router.navigate(['/driver/dashboard']);
    } else {
      router.navigate(['/client/home']);
    }
    return false;
  };
};
