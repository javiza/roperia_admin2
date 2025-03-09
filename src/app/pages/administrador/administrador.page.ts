import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IngresoUsuariosComponent } from 'src/app/components/ingreso-usuarios/ingreso-usuarios.component';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IngresoUsuariosComponent]
})
export class AdministradorPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
