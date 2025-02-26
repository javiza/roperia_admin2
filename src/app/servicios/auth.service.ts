import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DbService } from './db.service';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  private jwtHelper = new JwtHelperService();
  constructor(private dbService: DbService, private router: Router) {}

  async login(rut: string, password: string): Promise<{ token: string } | null> {
    try {
      const usuario = await this.dbService.getUsuarioPorRut(rut);
      if (usuario && usuario.password === password) {
        const token = this.generarToken(usuario);
        localStorage.setItem('token', token);
        return { token };
      } else {
        return null;
      }
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
    };
    return btoa(JSON.stringify(payload)); // Simulación de JWT (Reemplazar con una librería real si es necesario)
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
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp * 1000;
    return exp > Date.now();
  } catch {
    return false;
  }
}
}
