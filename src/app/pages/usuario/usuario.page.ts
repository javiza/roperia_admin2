

import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ListaComponent } from '../../components/lista/lista.component'
import { RouterModule } from '@angular/router'
import { addIcons } from 'ionicons'
import { settingsOutline } from 'ionicons/icons'
import { LavanderiaComponent } from '../../components/lavanderia/lavanderia.component';

@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.scss'],
  standalone: true,
  imports: [RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, ListaComponent],
})
export class UsuarioPage implements OnInit {

  @ViewChild(ListaComponent) lista!:ListaComponent
  @ViewChild(LavanderiaComponent) lavanderia!:LavanderiaComponent
  constructor() {
    addIcons({
      settingsOutline
    })
  }
  ngOnInit(): void {
    console.log("UsuarioPage::ngOnInit")
  }
  ionViewWillEnter():void {
    console.log("UsuarioPage::ionViewWillEnter")
    this.lista.ionViewWillEnter() 
    this.lavanderia.ionViewWillEnter()
  }
}
