import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { FormularioInicioComponent } from '../../components/formulario-inicio/formulario-inicio.component'
import { RouterModule } from '@angular/router'
import { addIcons } from 'ionicons'
import { settingsOutline } from 'ionicons/icons'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, FormularioInicioComponent],
})
export class HomePage implements OnInit {

  @ViewChild(FormularioInicioComponent) formulario!:FormularioInicioComponent

  constructor() {
    addIcons({
      settingsOutline
    })
  }
  ngOnInit(): void {
    console.log("HomePage::ngOnInit")
  }
  
  ionViewWillEnter(): void {
    console.log("HomePage::ionViewWillEnter");
  }
}