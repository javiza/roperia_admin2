import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonHeader, IonButton, IonText, IonItem, IonInput, IonLabel, IonTitle, IonToolbar, IonContent, IonList } from "@ionic/angular/standalone";
import { ProductoService } from 'src/app/servicios/producto.service';
import { DbService } from 'src/app/servicios/db.service';

@Component({
  selector: 'app-ingreso-usuarios',
  templateUrl: './ingreso-usuarios.component.html',
  styleUrls: ['./ingreso-usuarios.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonItem, IonInput, IonLabel, IonTitle, IonToolbar, IonContent, IonHeader, IonList, ReactiveFormsModule]
})
export class IngresoUsuariosComponent implements OnInit {
  ingresarUsuarioForm: FormGroup;
  usuarios: any[] = [];

  constructor(private fb: FormBuilder, private productoService: ProductoService, private dbService: DbService) {
    this.ingresarUsuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      rut: ['', [Validators.required, this.validarRutChileno]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required]
    }, { validator: this.passwordsIguales });
  }

  async ngOnInit() {
    await this.dbService.iniciarPlugin();

    // Depurar tablas para verificar su contenido
    await this.dbService.depurarTablas();

    // Verificar si hay roperías en la base de datos
    const roperia = await this.dbService.getRoperiaId();
    if (!roperia) {
        console.error("No hay ropería disponible. No se puede continuar.");
        return;
    }
    console.log("🛠️ Ropería encontrada:", roperia);

    this.cargarUsuarios();
}
  

  validarRutChileno(control: AbstractControl): { [key: string]: boolean } | null {
    const rut = control.value;
    if (!rut || rut.length < 8 || rut.length > 10) {
      return { rutInvalido: true };
    }
    // Aquí puedes agregar la lógica para validar el RUT chileno
    return null;
  }

  passwordsIguales(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const repetirPassword = group.get('repetirPassword')?.value;
    return password === repetirPassword ? null : { noCoinciden: true };
  }

  async onSubmit() {
    if (this.ingresarUsuarioForm.valid) {
        const { nombre, rut, password } = this.ingresarUsuarioForm.value;

        // Obtener un roperia_id válido desde la base de datos
        const roperia = await this.dbService.getRoperiaId();
        if (!roperia) {
            console.error("No hay ropería disponible. No se puede agregar el usuario.");
            return;
        }

        console.log('Usuario ingresado:', { nombre, rut, password });

        await this.productoService.agregarUsuario(nombre, rut, password);
        this.cargarUsuarios();
    }
}
  

  async cargarUsuarios() {
    this.usuarios = await this.productoService.getUsuarios();
  }

  editarUsuario(usuario: any) {
    this.ingresarUsuarioForm.patchValue(usuario);
  }

  async eliminarUsuario(id: number) {
    await this.productoService.eliminarUsuario(id);
    this.cargarUsuarios();
  }
}
