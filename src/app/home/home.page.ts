
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ListaComponent } from '../lista/lista.component';
import { RouterModule } from '@angular/router'
import { addIcons } from 'ionicons'
import { settingsOutline } from 'ionicons/icons'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [RouterModule, IonHeader, IonToolbar, IonTitle, IonContent, ListaComponent],
})
export class HomePage implements OnInit {

  @ViewChild(ListaComponent) lista!:ListaComponent

  constructor() {
    addIcons({
      settingsOutline
    })
  }
  ngOnInit(): void {
    console.log("HomePage::ngOnInit")
  }
  ionViewWillEnter():void {
    console.log("HomePage::ionViewWillEnter")
    this.lista.ionViewWillEnter() 
    
  }
}