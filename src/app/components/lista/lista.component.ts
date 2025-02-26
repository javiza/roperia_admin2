import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from '../../modelo/producto';
import { IonButton, IonItem, IonLabel, IonInput, IonList, IonContent, IonButtons,
  IonToolbar, IonTitle, IonHeader, IonModal } from '@ionic/angular/standalone';
import { DbService } from '../../servicios/db.service';
import { ProductoService } from '../../servicios/producto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonInput, IonList, FormsModule, CommonModule]
})
export class ListaComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
  nombre: string = '';
  descripcion: string = '';
  cantidad: number = 0;
  isEditing: boolean = false;  // Nueva variable de estado para la edición
  productoEditando: Producto | null = null; // Producto que estamos editando
 // En ListaComponent, actualiza la definición de totalPorPrenda
  totalPorPrenda: { [key: string]: { nombre: string, descripcion: string, cantidad: number } } = {};

  modalOpen: boolean = false;  // Estado del modal

  constructor(
    private dbService: DbService,
    private productoService: ProductoService
  ) {}

  async ngOnInit() {
    console.log("ListaComponent::ngOnInit - DbService::iniciarPlugin()");
    await this.dbService.iniciarPlugin();
    const productos = await this.dbService.obtenerTodos();
    console.log(productos);
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
    
    // Agrupar y sumar cantidades por nombre, manteniendo la descripción
    this.totalPorPrenda = this.productos.reduce((acc, producto) => {
      if (!acc[producto.nombre]) {
        acc[producto.nombre] = {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          cantidad: 0
        };
      }
      acc[producto.nombre].cantidad += producto.cantidad; // Sumar cantidades
      return acc;
    }, {} as { [key: string]: { nombre: string, descripcion: string, cantidad: number } });
  }
  

  async agregarProducto() {
    let p: Producto;

    if (this.isEditing && this.productoEditando) {
      // Si estamos editando, actualizamos el producto
      p = {
        ...this.productoEditando,
        nombre: this.nombre,
        descripcion: this.descripcion,
        cantidad: this.cantidad
      };
      await this.productoService.editar(p);  // Editar producto
    } else {
      // Si no estamos editando, creamos un nuevo producto
      p = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        cantidad: this.cantidad
      };
      await this.productoService.agregarProducto(p);  // Agregar nuevo producto
    }

    // Actualizar la lista y limpiar el formulario
    await this.actualizar();
    this.nombre = '';
    this.descripcion = '';
    this.cantidad = 0;
    this.isEditing = false;  // Restablecer el estado de edición
    this.productoEditando = null;  // Restablecer el producto en edición
  }

  async onProductoChange(p: Producto) {
    this.isEditing = true;  // Marcamos que estamos editando
    this.productoEditando = p;  // Guardamos el producto que estamos editando
    this.nombre = p.nombre;  // Llenamos los campos del formulario
    this.descripcion = p.descripcion;
    this.cantidad = p.cantidad;
  }

  async eliminarProducto(id: number) {
    await this.productoService.eliminar(id);  // Eliminar producto
    await this.actualizar();  // Actualizar la lista después de eliminar
  }

  // Función para abrir el modal
  abrirModal() {
    this.modalOpen = true;
  }

  // Función para cerrar el modal
  cerrarModal() {
    this.modalOpen = false;
  }

  // Función para imprimir (simple ejemplo)
  imprimir() {
    window.print();
  }
}
