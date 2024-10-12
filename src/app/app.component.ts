
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { DbService } from './servicios/db.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  private sqlite: SQLiteConnection | undefined;

  constructor(private dbService: DbService) {
    this.initializeApp();
  }

  async initializeApp() {
    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqlite = document.querySelector('jeep-sqlite');
      if (jeepSqlite != null) {
        await (jeepSqlite as any).initWebStore();
      }
    }
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
    await this.dbService.iniciarPlugin();
  }
}

