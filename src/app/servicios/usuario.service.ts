import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelo/producto';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  registrar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, usuario);
  }

  login(rut: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { rut, password });
  }

  obtenerUsuario(): Observable<any> {
    return this.http.get(`${this.API_URL}/usuario-info`, {
      headers: this.getHeaders()
    });
  }

  actualizarUsuario(id: number, datos: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.API_URL}/usuario/${id}`, datos, {
      headers: this.getHeaders()
    });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/usuario/${id}`, {
      headers: this.getHeaders()
    });
  }
}
