import { Injectable } from '@angular/core';
import { Producto } from '../modelo/producto';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private dbService: DbService
  ) { }

  async agregarProducto(producto: Producto) {
    await this.dbService.insertar(producto);
  }

  async getProductos(): Promise<Producto[]> {
    return this.dbService.obtenerTodos();
  }
  
  async getProductosOrdenadosAlfabeticamente(): Promise<Producto[]> {
    const productos = await this.getProductos();
    return productos?.sort((a, b) => a?.nombre?.localeCompare(b?.nombre));
  }

  async editar(producto: Producto) {
    await this.dbService.actualizar(producto);
  }

  async eliminar(id: number) {
    if (id !== undefined && id > 0) {
      await this.dbService.eliminar(id);
    }    
  }

  async agregarLavanderia(nombre_prenda: string, roperia_id: number) {
    await this.dbService.insertarLavanderia(nombre_prenda, roperia_id);
  }

  async agregarUnidad(nombre_prenda: string, roperia_id: number) {
    await this.dbService.insertarUnidad(nombre_prenda, roperia_id);
  }

  async agregarBaja(nombre_prenda: string, roperia_id: number) {
    await this.dbService.insertarBajas(nombre_prenda, roperia_id);
  }

  async agregarFuncionario(nombre_funcionario: string, nombre_prenda: string, roperia_id: number) {
    await this.dbService.insertarFuncionario(nombre_funcionario, nombre_prenda, roperia_id);
  }
}

