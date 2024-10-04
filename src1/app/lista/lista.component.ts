import { Component, OnInit, OnDestroy } from '@angular/core';
import { Prenda } from '../model/prenda';
import { IonButton, IonItem, IonLabel, IonInput, IonList } from '@ionic/angular/standalone';
import { DbService } from '../servicios/db.service';
import { PrendaService } from '../servicios/prenda.service';
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
  prendas: Prenda[] = [];
  ordenarAlfabeticamente: boolean = false;
  nombre: string = '';
  descripcion: string = '';

  constructor(
    private dbService: DbService,
    private prendaService: PrendaService
  ) {}

  async ngOnInit() {
    console.log("FormularioComponent::ngOnInit - DbService::iniciarPlugin()");
    await this.dbService.iniciarPlugin();
    await this.actualizar();
  }

  async ngOnDestroy() {
    console.log("FormularioComponent::ngOnDestroy");
    await this.dbService.cerrarConexion();
  }

  async ionViewWillEnter() {
    console.log("FormularioComponent::ionViewWillEnter");
    if (this.dbService.iniciado) {
      console.log("dbService INICIADO -- actualizar()");
      await this.actualizar();
    } else {
      console.log("dbService AUN NO INICIADO");
    }
  }

  async actualizar() {
    console.log("actualizando...");
    this.prendas = await this.prendaService.getPrendas();
  }

  async agregarProducto() {
    const p: Prenda = {
      nombre: this.nombre,
      cantidad: 1,
      descripcion: this.descripcion
    };
    await this.prendaService.agregarPrenda(p);
    await this.actualizar();
    this.nombre = '';
    this.descripcion = '';
  }

  async onPrendaChange(p: Prenda) {
    await this.prendaService.editar(p);
    await this.actualizar();
  }
}
