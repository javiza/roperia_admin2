import { Component, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton} from '@ionic/angular/standalone';
//import { ListaComponent } from '../../components/lista/lista.component'
import { RouterModule } from '@angular/router'
import { addIcons } from 'ionicons'
import { settingsOutline } from 'ionicons/icons'
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-usuario',
  templateUrl: 'usuario.page.html',
  styleUrls: ['usuario.page.scss'],
  standalone: true,
  imports: [IonButtons, RouterModule, IonHeader, IonToolbar, IonTitle, IonButton, IonContent],
})
export class UsuarioPage implements OnInit {

  //@ViewChild(ListaComponent) lista!:ListaComponent
  // @ViewChild(LavanderiaComponent) lavanderia!:LavanderiaComponent
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
    // this.lista.ionViewWillEnter() 
    // this.lavanderia.ionViewWillEnter()
  }
  logout() {
    this.authService.logout(); // Llamar al servicio para cerrar sesión
    this.navCtrl.navigateRoot('/home'); // Redirigir a la página de inicio
  }
}
