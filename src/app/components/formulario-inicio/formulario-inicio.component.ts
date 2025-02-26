import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { NavController } from '@ionic/angular';
import { DbService } from 'src/app/servicios/db.service';
import { IonHeader, IonButton, IonText, IonItem, IonInput, IonLabel, IonTitle, 
  IonToolbar, IonContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-formulario-inicio',
  templateUrl: './formulario-inicio.component.html',
  styleUrls: ['./formulario-inicio.component.scss'],
  standalone: true,
  imports: [IonButton, IonText, IonItem, IonInput, IonLabel, IonTitle, IonToolbar, IonContent,
    IonHeader, ReactiveFormsModule
   ]
})
export class FormularioInicioComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isRegisterMode: boolean = false; // Modo para alternar entre login y registro

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dbService: DbService,
    private navCtrl: NavController
  ) {
    this.loginForm = this.fb.group({
      nombre_usuario: [''], // Campo solo en registro
      rut: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''] // Campo solo en registro
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      const { nombre_usuario, rut, password, confirmPassword } = this.loginForm.value;

      if (this.isRegisterMode) {
        // Modo Registro
        if (password !== confirmPassword) {
          this.errorMessage = "Las contraseñas no coinciden";
          return;
        }

        try {
          await this.dbService.insertarUsuario(nombre_usuario, rut, password, 1); // 1 como ID de ropería por defecto
          alert("Usuario registrado con éxito");
          this.toggleMode(); // Volver al modo login
        } catch (error) {
          this.errorMessage = "Error al registrar usuario";
          console.error(error);
        }
      } else {
        // Modo Inicio de Sesión
        const result = await this.authService.login(rut, password);
        if (result) {
          console.log('Inicio de sesión exitoso', result);
          this.navCtrl.navigateRoot('/pages/usuario');
        } else {
          this.errorMessage = 'Rut o contraseña incorrectos';
        }
      }
    }
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = ''; // Limpiar errores al cambiar de modo
    this.loginForm.reset(); // Resetear formulario
  }
}
