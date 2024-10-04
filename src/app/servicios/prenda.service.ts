import { Injectable } from '@angular/core';
import { Prenda } from '../model/prenda'; 
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class PrendaService {

  constructor(
    private dbService:DbService
  ) { }

  async agregarPrenda(prenda:Prenda) {
    this.dbService.insertar(prenda)    
  }

  async getPrendas():Promise<Prenda[]> {
    return this.dbService.obtenerTodos()
  }
  
  async getPrendasOrdenadasAlfabeticamente():Promise<Prenda[]> {
    const prendas = await this.getPrendas()
    return prendas?.sort((a,b) => a?.nombre?.localeCompare(b?.nombre))
  }

  async editar(prenda:Prenda) {
    await this.dbService.actualizar(prenda)
  }

  async eliminar(prenda:Prenda) {
    if( prenda.id != undefined && prenda.id > 0 ) {
      await this.dbService.eliminar(prenda.id)
    }    
  }
}