import { Injectable } from '@angular/core';
import { Usuario } from '../modelo/producto';

interface DecodedToken {
  id?: number;
  rut?: string;
  role?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual: Usuario | null = null;
  private readonly BACKEND_URL = 'http://localhost:3000';

  constructor() {}

  async login(rut: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rut, password }),
      });

      if (!res.ok) {
        return false;
      }

      const { token } = await res.json();
      localStorage.setItem('token', token);

      const usuario = await this.obtenerUsuarioActualBackend();
      if (usuario) {
        this.usuarioActual = usuario;
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error login:', err);
      return false;
    }
  }

  logout() {
    this.usuarioActual = null;
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const decoded = this.decodeToken(token);
    if (!decoded) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      this.logout();
      return false;
    }
    return true;
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    const decoded = this.decodeToken(token);
    return decoded?.role ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  }

  async obtenerUsuarioActualBackend(): Promise<Usuario | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    const res = await fetch(`${this.BACKEND_URL}/usuario-info`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data?.user) {
      return {
        id: data.user.id,
        rut: data.user.rut,
        nombre_usuario: data.user.nombre_usuario || '',
        password: '',
        role: data.user.role,
      };
    }
    return null;
  }
}
