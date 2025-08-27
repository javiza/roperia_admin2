import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonSegment, 
  IonSegmentButton, 
  IonButton, 
  IonText, 
  IonSpinner 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-formulario-inicio',
  templateUrl: './formulario-inicio.component.html',
  styleUrls: ['./formulario-inicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSegment,
    IonSegmentButton,
    IonButton,
    IonText,
    IonSpinner
  ]
})
export class FormularioInicioComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required, Validators.pattern(/^\d{7,9}-[0-9kK]$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => this.errorMessage = '');
    const tokenRole = this.authService.getRoleFromToken();
    if (tokenRole) {
      this.loginForm.patchValue({ role: tokenRole.toLowerCase() });
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente';
      return;
    }
    this.loading = true;
    const { rut, password, role } = this.loginForm.value;

    try {
      const success = await this.authService.login(rut, password);
      if (!success) { 
        this.errorMessage = 'RUT o contraseña incorrectos'; 
        return; 
      }

      const tokenRole = this.authService.getRoleFromToken();
      if (!tokenRole) { 
        this.errorMessage = 'Token inválido'; 
        return; 
      }

      if (tokenRole.toLowerCase() !== role.toLowerCase()) {
        this.errorMessage = `El rol seleccionado no coincide con tus permisos`;
        return;
      }

      switch (tokenRole.toLowerCase()) {
        case 'admin': this.router.navigate(['/admin']); break;
        case 'usuario': this.router.navigate(['/usuario']); break;
        default: this.errorMessage = 'Rol no permitido';
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.';
    } finally { 
      this.loading = false; 
    }
  }
}
