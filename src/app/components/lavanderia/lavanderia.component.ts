
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lavanderia } from '../../modelo/producto';
import { IonButton, IonItem, IonLabel, IonInput, IonList } from '@ionic/angular/standalone';
import { DbService } from '../../servicios/db.service';
import { ProductoService } from '../../servicios/producto.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lavanderia',
  templateUrl: './lavanderia.component.html',
  styleUrls: ['./lavanderia.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonInput, IonList, FormsModule, CommonModule]
})
export class LavanderiaComponent implements OnInit, OnDestroy {
  productos: Lavanderia[] = [];
 

  nombre_prenda: string = '';
  cantidad: number = 0;
  // roperia_id: number = 1;

  constructor(
    private dbService: DbService,
    private productoService: ProductoService
  ) {}

  async ngOnInit() {
    console.log("ListaComponent::ngOnInit - DbService::iniciarPlugin()");
    await this.dbService.iniciarPlugin();

    const productos = await this.dbService.obtenerTodos();
    console.log(productos)
    await this.actualizar();
  }

  async ngOnDestroy() {
    console.log("ListaComponent::ngOnDestroy");
    await this.dbService.cerrarConexion();
  }

  async ionViewWillEnter() {
    console.log("ListaComponent::ionViewWillEnter");
    if (this.dbService.iniciado) {
      console.log("dbService INICIADO -- actualizar()");
      await this.actualizar();
    } else {
      console.log("dbService AUN NO INICIADO");
    }
  }

  async actualizar() {
    console.log("actualizando...");
    this.productos = await this.productoService.getLavanderia();
  }

  async agregarProducto() {
    const p: Lavanderia = {
      nombre_prenda: this.nombre_prenda.trim(),
      cantidad: this.cantidad > 0 ? this.cantidad : 1,
      roperia_id: 0
    };
    await this.productoService.agregarLavanderia(p);
    await this.actualizar();
    this.nombre_prenda = '';
    this.cantidad = 1;
    // this.roperia_id = 1;
  }
  
  

  async onProductoChange(p: Lavanderia) {
    await this.productoService.editarRopaLavanderia(p);
    await this.actualizar();
  }
  

  async eliminarProducto(id: number | undefined) {
    if (!id || id <= 0) {
      console.error("ID inválido para eliminar producto.");
      return;
    }
    await this.productoService.eliminar(id);
    await this.actualizar();
  }
}
