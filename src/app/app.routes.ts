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
    loadComponent: () => import('./pages/usuario/usuario.page').then(m => m.UsuarioPage),
    canActivate: [AuthGuard],
    data: { role: 'usuario' } // <-- rol esperado para acceder
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/administrador/administrador.page').then(m => m.AdministradorPage),
    canActivate: [AuthGuard],
    data: { role: 'admin' } // <-- rol esperado para acceder
  },
  {
    path: 'unidad',
    loadComponent: () => import('./pages/unidad/unidad.page').then( m => m.UnidadPage)
  },
  {
    path: 'lavanderia',
    loadComponent: () => import('./pages/lavanderia/lavanderia.page').then( m => m.LavanderiaPage)
  },
  {
    path: 'bajas-reparaciones',
    loadComponent: () => import('./pages/bajas-reparaciones/bajas-reparaciones.page').then( m => m.BajasReparacionesPage)
  },
  {
    path: 'inventarios',
    loadComponent: () => import('./pages/inventarios/inventarios.page').then( m => m.InventariosPage)
  },
];
