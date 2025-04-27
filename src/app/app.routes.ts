import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'usuario',
    loadComponent: () => import('./pages/usuario/usuario.page').then( m => m.UsuarioPage),
    canActivate: [AuthGuard], // Protege la ruta de usuario
  },
  {
    path: 'administrador',
    loadComponent: () => import('./pages/administrador/administrador.page').then( m => m.AdministradorPage)
  },
];
