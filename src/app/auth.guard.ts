import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/home']); // Redirige al login si no está autenticado
      return false;
    }

    // Obtener rol esperado de la ruta
    const expectedRole = (route.data['role'] as string)?.toLowerCase();

    // Obtener rol desde el token
    const tokenRole = this.authService.getRoleFromToken()?.toLowerCase();

    // Validar rol
    if (!tokenRole || tokenRole !== expectedRole) {
      this.router.navigate(['/home']); // Redirige si el rol no coincide
      return false;
    }

    return true; // Permite acceso si todo está correcto
  }
}
