import { Injectable } from '@angular/core';
import { Usuario, Prenda, Lavanderia, Bajas, Unidad } from '../modelo/producto';
import { DbService } from './db.service';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  constructor(
    private dbService: DbService,
    private usuarioService: UsuarioService
  ) {}

  // //#region CRUD Usuario vía API
  // async agregarUsuario(usuario: Usuario) {
  //   return this.usuarioService.registrar(usuario).toPromise();
  // }

  // async getUsuarios(token: string) {
  //   return this.usuarioService.obtenerUsuario(token).toPromise();
  // }

  // async actualizarUsuario(id: number, datos: Partial<Usuario>, token: string) {
  //   return this.usuarioService.actualizarUsuario(id, datos, token).toPromise();
  // }

  // async eliminarUsuario(id: number, token: string) {
  //   return this.usuarioService.eliminarUsuario(id, token).toPromise();
  // }
  // //#endregion

  //#region CRUD Prenda, Lavanderia, Unidad, Bajas
  async agregarProducto(producto: Prenda) { await this.dbService.insertarPrenda(producto); }
  async getProductos(): Promise<Prenda[]> { return this.dbService.obtenerTodasPrenda(); }
  async editarProducto(producto: Prenda) { await this.dbService.actualizarPrenda(producto); }
  async eliminarProducto(id: number) { await this.dbService.eliminarPrenda(id); }

  async agregarLavanderia(lav: Lavanderia) { await this.dbService.insertarLavanderia(lav); }
  async getLavanderias(): Promise<Lavanderia[]> { return this.dbService.obtenerTodasLavanderias(); }
  async eliminarLavanderia(id: number) { await this.dbService.eliminarLavanderia(id); }

  async agregarUnidad(unidad: Unidad) { await this.dbService.insertarUnidad(unidad); }
  async getUnidades(): Promise<Unidad[]> { return this.dbService.obtenerTodasUnidad(); }
  async eliminarUnidad(id: number) { await this.dbService.eliminarUnidad(id); }

  async agregarBaja(baja: Bajas) { await this.dbService.insertarBajas(baja); }
  async getBajas(): Promise<Bajas[]> { return this.dbService.obtenerTodasBajas(); }
  async eliminarBaja(id: number) { await this.dbService.eliminarBajas(id); }
  //#endregion
}
