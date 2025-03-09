import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(private dbService: DbService, private router: Router) {}

  async login(rut: string, password: string): Promise<{ token: string } | null> {
    try {
      const usuario = await this.dbService.getUsuarioPorRut(rut);
  
      if (!usuario) {
        console.log('Usuario no encontrado');
        return null;
      }
  
      // Comparar la contraseña ingresada con el hash almacenado
      const passwordMatch = await bcrypt.compare(password, usuario.password);
  
      if (!passwordMatch) {
        console.log('Contraseña incorrecta');
        return null;
      }
  
      // Si la contraseña es válida, generar token y redirigir
      const token = this.generarToken(usuario);
      localStorage.setItem('token', token);
      return { token };
      
    } catch (error) {
      console.error('Error en login:', error);
      return null;
    }
  }
  

  generarToken(usuario: any): string {
    const payload = {
      id: usuario.id,
      rut: usuario.rut,
      nombre: usuario.nombre_usuario,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // Expira en 1 hora
    };
    return btoa(JSON.stringify(payload)); // Simulación de JWT, usar una librería real para producción
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = JSON.parse(atob(token)); // Decodificar
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
