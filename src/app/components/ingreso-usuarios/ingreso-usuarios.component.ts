import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonButton, IonText, IonItem, IonInput, IonLabel, IonTitle, IonToolbar, IonContent, IonList } from "@ionic/angular/standalone";
import { DbService } from 'src/app/servicios/db.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-ingreso-usuarios',
  templateUrl: './ingreso-usuarios.component.html',
  styleUrls: ['./ingreso-usuarios.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonItem,
    IonInput,
    IonLabel,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    IonList
  ],
  providers: [DbService, UsuarioService] // Asegura inyección
})
export class IngresoUsuariosComponent implements OnInit {
  ingresarUsuarioForm: FormGroup;
  usuarios: any[] = [];
  usuarioEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dbService: DbService,
    private usuarioService: UsuarioService
  ) {
    this.ingresarUsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, this.validarRutChileno]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required]
    }, { validator: this.passwordsIguales });
  }

  ngOnInit(): void {
    (async () => {
      await this.dbService.iniciarPlugin();
      await this.dbService.depurarTablas();
      const roperia = await this.dbService.getRoperiaId();
      if (!roperia) {
        return console.error("No hay ropería disponible.");
      }
      await this.cargarUsuarios();
    })();
  }

  validarRutChileno(control: AbstractControl): { [key: string]: boolean } | null {
    const rut = control.value;
    if (!rut || rut.length < 8 || rut.length > 10) {
      return { rutInvalido: true };
    }
    return null;
  }

  passwordsIguales(group: FormGroup): { [key: string]: boolean } | null {
    return group.get('password')?.value === group.get('repetirPassword')?.value ? null : { noCoinciden: true };
  }

  async onSubmit() {
    if (!this.ingresarUsuarioForm.valid) {
      return;
    }
    const { nombre, rut, password } = this.ingresarUsuarioForm.value;
    const roperia = await this.dbService.getRoperiaId();
    if (!roperia) {
      return console.error("No hay ropería disponible.");
    }
    const nuevoUsuario = { id: 0, nombre_usuario: nombre, rut, password, role: 'usuario' };
    await firstValueFrom(this.usuarioService.registrar(nuevoUsuario));
    await this.cargarUsuarios();
    this.ingresarUsuarioForm.reset();
  }

  async cargarUsuarios() {
    const res = await firstValueFrom(this.usuarioService.obtenerUsuario());
    this.usuarios = res?.user ? [res.user] : Array.isArray(res) ? res : [];
  }

  editarUsuario(usuario: any) {
    this.usuarioEditandoId = usuario.id;
    this.ingresarUsuarioForm.patchValue({
      nombre: usuario.nombre_usuario,
      rut: usuario.rut,
      password: '',
      repetirPassword: ''
    });
  }

  async eliminarUsuario(id: number) {
    await firstValueFrom(this.usuarioService.eliminarUsuario(id));
    await this.cargarUsuarios();
  }
}
