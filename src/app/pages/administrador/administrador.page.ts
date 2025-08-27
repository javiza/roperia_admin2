import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSegment, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonSegmentButton } from '@ionic/angular/standalone';
import { settingsOutline } from 'ionicons/icons'
import { AuthService } from 'src/app/auth/auth.service';
import {  NavController } from '@ionic/angular';
import { addIcons } from 'ionicons'
//import { IngresoUsuariosComponent } from 'src/app/components/ingreso-usuarios/ingreso-usuarios.component';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
  standalone: true,
  imports: [IonSegment, IonSegmentButton, IonButtons, IonButton, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons
  
  ]
})
export class AdministradorPage implements OnInit {
   activeSegment: string = 'home';
constructor(private authService: AuthService, private navCtrl: NavController) {
    addIcons({
      settingsOutline
    })
  }
  ngOnInit(): void {
    console.log("UsuarioPage::ngOnInit")
  }
  ionViewWillEnter():void {
    console.log("UsuarioPage::ionViewWillEnter")

  }
  logout() {
    this.authService.logout(); // Llamar al servicio para cerrar sesión
    this.navCtrl.navigateRoot('/home'); // Redirigir a la página de inicio
  }
}
