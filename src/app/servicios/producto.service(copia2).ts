// import { Injectable } from '@angular/core';
// import { Producto, Lavanderia } from '../modelo/producto';
// import { DbService } from './db.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductoService {

//   constructor(
//     private dbService: DbService
//   ) { }

//   async agregarProducto(producto: Producto) {
//     await this.dbService.insertar(producto);
//   }
  
//   async getProductos(): Promise<Producto[]> {
//     return this.dbService.obtenerTodos();
//   }
 
//   async getProductosOrdenadosAlfabeticamente(): Promise<Producto[]> {
//     const productos = await this.getProductos();
//     return productos?.sort((a, b) => a?.nombre?.localeCompare(b?.nombre));
//   }

//   async editar(producto: Producto) {
//     await this.dbService.actualizar(producto);
//   }

//   async eliminar(id: number) {
//     if (id !== undefined && id > 0) {
//       await this.dbService.eliminar(id);
//     }    
//   }
//   async editarRopaLavanderia(producto: Lavanderia) {
//     await this.dbService.actualizarLavanderia(producto);
//   }
//   async getLavanderia(): Promise<Lavanderia[]> {
//     return this.dbService.obtenerTodosLavanderia();
//   }
//   async agregarLavanderia(producto: Lavanderia) {
//     await this.dbService.insertarRopaLavanderia(producto);
//   }
//   async eliminarLavanderia(id: number) {
//     if (id !== undefined && id > 0) {
//       await this.dbService.eliminarLavanderia(id);
//     }
//   }
  

//   async agregarUnidad(nombre_prenda: string, cantidad: number, roperia_id: number) {
//     await this.dbService.insertarRopaUnidad(nombre_prenda, cantidad, roperia_id);
//   }

//   async agregarBaja(nombre_prenda: string, cantidad: number, roperia_id: number) {
//     await this.dbService.insertarBajas(nombre_prenda, cantidad, roperia_id);
//   }

//   async agregarFuncionario(nombre_funcionario: string, nombre_prenda: string, roperia_id: number) {
//     await this.dbService.insertarFuncionario(nombre_funcionario, nombre_prenda, roperia_id);
//   }
//   async agregarUsuario(nombre_usuario: string, rut: string, password: string, roperia_id: number) {
//     await this.dbService.insertarUsuario(nombre_usuario, rut, password, roperia_id);
//   }
//   async agregarAdmin(nombre_admin: string, rut: string, password: string) {
//     await this.dbService.insertarAdmin(nombre_admin, rut, password);
//   }

//   async getUsuarios(): Promise<any[]> {
//     return this.dbService.obtenerTodosUsuarios();
//   }

//   async eliminarUsuario(id: number) {
//     await this.dbService.eliminarUsuario(id);
//   }
// }

