import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

import { defineCustomElements } from 'jeep-sqlite/loader';
import { defineCustomElements as defineIonicElements } from '@ionic/pwa-elements/loader';

// Modo producción
if (environment.production) {
  enableProdMode();
}

// Inicializar custom elements antes de bootstrapping
defineCustomElements(window);
defineIonicElements(window);

// Bootstrapping principal
bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(), // Provee NavController, etc.
    provideRouter(routes), // Router
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Estrategia de routing
  ]
})
.catch(err => console.error(err));
