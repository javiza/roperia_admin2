import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/servicios/db.service';
import { CommonModule } from '@angular/common';
import { IonHeader, IonButton, IonText, IonItem, IonInput, IonLabel, IonTitle, IonToolbar, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-formulario-inicio',
  templateUrl: './formulario-inicio.component.html',
  styleUrls: ['./formulario-inicio.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonText, IonItem, IonInput, IonTitle, IonToolbar, IonContent, IonHeader, ReactiveFormsModule]
})
export class FormularioInicioComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dbService: DbService,
    private navCtrl: NavController
  ) {
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const { rut, password } = this.loginForm.value;
  
      const result = await this.authService.login(rut, password);
      if (result) {
        console.log('Inicio de sesión exitoso', result);
        this.navCtrl.navigateRoot('/usuario'); // Redirigir correctamente
      } else {
        this.errorMessage = 'Rut o contraseña incorrectos';
      }
    }
  }
  
}
