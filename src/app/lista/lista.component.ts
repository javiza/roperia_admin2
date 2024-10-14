import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from '../modelo/producto';
import { IonButton, IonItem, IonLabel, IonInput, IonList } from '@ionic/angular/standalone';
import { DbService } from '../servicios/db.service';
import { ProductoService } from '../servicios/producto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonLabel, IonInput, IonList, FormsModule, CommonModule]
})
export class ListaComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
 
  nombre: string = '';
  descripcion: string = '';
 

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
    this.productos = await this.productoService.getProductos();
  }

  async agregarProducto() {
    const p: Producto = {
      nombre: this.nombre,
      descripcion: this.descripcion
    };
    await this.productoService.agregarProducto(p);
    await this.actualizar();
    this.nombre = '';
    this.descripcion = '';
    
  }

  async onProductoChange(p: Producto) {
    await this.productoService.editar(p);
    await this.actualizar();
  }
  

  async eliminarProducto(id: number) {
    await this.productoService.eliminar(id); // Ahora esto está correcto
    await this.actualizar(); // Actualiza la lista después de eliminar
  }
}