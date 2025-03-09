import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/usuario/usuario.page').then( m => m.UsuarioPage)
  },
  {
    path: 'administrador',
    loadComponent: () => import('./pages/administrador/administrador.page').then( m => m.AdministradorPage)
  },
];
