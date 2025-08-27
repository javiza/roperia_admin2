import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Roperia, Prenda, Lavanderia, Lavado, Unidad, Unidad_retorno, Bajas } from '../modelo/producto';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  public platform: string = '';
  public iniciado: boolean = false;

  // Configuración DB
  private readonly DB_NAME = 'adminRopa';
  private readonly DB_VERSION = 1;
  private readonly DB_ENCRYPTION = false;
  private readonly DB_MODE = 'no-encryption';
  private readonly DB_READ_ONLY = false;

  // Tablas
  private readonly DB_TABLE_ROPERIA = 'roperia';
  private readonly DB_TABLE_PRENDA = 'prenda';
  private readonly DB_TABLE_LAVANDERIA = 'lavanderia';
  private readonly DB_TABLE_LAVADO = 'lavado';
  private readonly DB_TABLE_UNIDAD = 'unidad';
  private readonly DB_TABLE_UNIDAD_RETORNO = 'unidad_retorno';
  private readonly DB_TABLE_UNIDAD_RSUCIAS = 'unidad_resucias';
  private readonly DB_TABLE_BAJAS = 'bajas';
  private readonly DB_TABLE_REPARACIONES = 'reparaciones';

  constructor() {}

  //#region Inicialización y conexión
  async iniciarPlugin(): Promise<void> {
    try {
      this.platform = Capacitor.getPlatform();

      if (!this.sqlite) {
        console.error('🚨 SQLite no está inicializado correctamente.');
        return;
      }

      // Inicialización para Web
      if (this.platform === 'web') {
        await customElements.whenDefined('jeep-sqlite');
        const jeepEl = document.querySelector('jeep-sqlite');
        if (jeepEl) {
          await this.sqlite.initWebStore();
        }
      }

      // Crear o recuperar conexión
      const connExists = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;
      this.db = connExists
        ? await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY)
        : await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);

      await this.db.open();

      // Crear tablas individualmente
      await this.crearTablasIndividuales();

      // Guardar en store web
      if (this.platform === 'web') {
        await this.sqlite.saveToStore(this.DB_NAME);
      }

      this.iniciado = true;
      console.log('✅ Base de datos inicializada correctamente');

    } catch (error) {
      console.error('🚨 Error al inicializar la base de datos:', error);
      this.iniciado = false;
    }
  }

  async cerrarConexion(): Promise<void> {
    try {
      await this.db.close();
      console.log('🔒 Conexión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar la conexión:', error);
    }
  }
 //#region Tablas Sqlite
  private async crearTablasIndividuales(): Promise<void> {
    const tablasSQL = [
      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_ROPERIA} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre_encargado TEXT,
        telefono TEXT,
        email TEXT
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_PRENDA} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_roperia INTEGER,
        nombre TEXT,
        descripcion TEXT,
        cantidad INTEGER,
        tipo TEXT,
        fecha_ingreso TEXT,
        FOREIGN KEY (id_roperia) REFERENCES ${this.DB_TABLE_ROPERIA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_LAVANDERIA} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_roperia INTEGER,
        nombre TEXT,
        rut TEXT,
        direccion TEXT,
        telefono TEXT,
        email TEXT,
        FOREIGN KEY (id_roperia) REFERENCES ${this.DB_TABLE_ROPERIA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_LAVADO} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_prenda INTEGER,
        cantidad INTEGER,
        fecha_ingreso TEXT,
        id_lavanderia INTEGER,
        FOREIGN KEY (id_prenda) REFERENCES ${this.DB_TABLE_PRENDA}(id),
        FOREIGN KEY (id_lavanderia) REFERENCES ${this.DB_TABLE_LAVANDERIA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_UNIDAD} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_roperia INTEGER,
        nombre_unidad TEXT,
        coordinador TEXT,
        telefono TEXT,
        mail TEXT,
        FOREIGN KEY (id_roperia) REFERENCES ${this.DB_TABLE_ROPERIA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_UNIDAD_RETORNO} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_unidad INTEGER,
        id_prenda INTEGER,
        cantidad_devuelta INTEGER,
        fecha_retorno TEXT,
        FOREIGN KEY (id_unidad) REFERENCES ${this.DB_TABLE_UNIDAD}(id),
        FOREIGN KEY (id_prenda) REFERENCES ${this.DB_TABLE_PRENDA}(id)
      );`,
      
       `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_UNIDAD_RSUCIAS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_unidad INTEGER,
        id_prenda INTEGER,
        cantidad_devuelta INTEGER,
        fecha_retorno TEXT,
        FOREIGN KEY (id_unidad) REFERENCES ${this.DB_TABLE_UNIDAD}(id),
        FOREIGN KEY (id_prenda) REFERENCES ${this.DB_TABLE_PRENDA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_BAJAS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_prenda INTEGER,
        cantidad INTEGER,
        detalle TEXT,
        destino TEXT,
        fecha_ingreso TEXT,
        FOREIGN KEY (id_prenda) REFERENCES ${this.DB_TABLE_PRENDA}(id)
      );`,

      `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_REPARACIONES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_prenda INTEGER,
        cantidad INTEGER,
        detalle TEXT,
        fecha_ingreso TEXT,
        FOREIGN KEY (id_prenda) REFERENCES ${this.DB_TABLE_PRENDA}(id)
      );`
    ];

    for (const sql of tablasSQL) {
      await this.db.execute(sql);
    }
  }
  //#endregion

  //#region CRUD Genérico
  private async ejecutar(sql: string, params: any[] = []): Promise<any> {
    if (!this.iniciado || !this.db) {
      return null;
    }
    try {
      return await this.db.run(sql, params);
    } catch (error) {
      console.error('Error en ejecución SQL:', sql, params, error);
      return null;
    }
  }

  private async query(sql: string, params: any[] = []): Promise<any[]> {
    if (!this.iniciado || !this.db) {
      return [];
    }
    try {
      const res = await this.db.query(sql, params);
      return res.values ?? [];
    } catch (error) {
      console.error('Error en consulta SQL:', sql, params, error);
      return [];
    }
  }
  //#endregion

  //#region CRUD Prenda
  async obtenerTodasPrenda(): Promise<Prenda[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_PRENDA}`);
  }

  async buscarPrendaPorNombre(nombre: string): Promise<Prenda[]> {
    if (!nombre) {
      return [];
    }
    return this.query(`SELECT * FROM ${this.DB_TABLE_PRENDA} WHERE nombre LIKE ?`, [`%${nombre}%`]);
  }

  async insertarPrenda(prenda: Prenda) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_PRENDA} (nombre, descripcion, cantidad, tipo, id_roperia) VALUES (?, ?, ?, ?, ?)`,
      [prenda.nombre, prenda.descripcion, prenda.cantidad, prenda.tipo, prenda.id_roperia]
    );
  }

  async actualizarPrenda(prenda: Prenda) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_PRENDA} SET nombre = ?, descripcion = ?, cantidad = ?, tipo = ? WHERE id = ?`,
      [prenda.nombre, prenda.descripcion, prenda.cantidad, prenda.tipo, prenda.id]
    );
  }

  async eliminarPrenda(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_PRENDA} WHERE id = ?`, [id]);
  }
  //#endregion

  //#region CRUD Lavandería
  async obtenerTodasLavanderias(): Promise<Lavanderia[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_LAVANDERIA}`);
  }

  async insertarLavanderia(lav: Lavanderia) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_LAVANDERIA} (id_roperia, nombre, rut, direccion, telefono, email) VALUES (?, ?, ?, ?, ?, ?)`,
      [lav.id_roperia, lav.nombre, lav.rut, lav.direccion, lav.telefono, lav.email]
    );
  }

  async actualizarLavanderia(lav: Lavanderia) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_LAVANDERIA} SET nombre = ?, rut = ?, direccion = ?, telefono = ?, email = ? WHERE id = ?`,
      [lav.nombre, lav.rut, lav.direccion, lav.telefono, lav.email, lav.id]
    );
  }

  async eliminarLavanderia(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_LAVANDERIA} WHERE id = ?`, [id]);
  }
  //#endregion

  //#region CRUD Lavado
  async obtenerTodosLavado(): Promise<Lavado[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_LAVADO}`);
  }

  async insertarRopaLavado(lavado: Lavado) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_LAVADO} (id_prenda, cantidad, fecha_ingreso, id_lavanderia) VALUES (?, ?, ?, ?)`,
      [lavado.id_prenda, lavado.cantidad, lavado.fecha_ingreso, lavado.id_lavanderia]
    );
  }

  async actualizarLavado(lavado: Lavado) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_LAVADO} SET id_prenda = ?, cantidad = ?, id_lavanderia = ?, fecha_ingreso = ? WHERE id = ?`,
      [lavado.id_prenda, lavado.cantidad, lavado.id_lavanderia, lavado.fecha_ingreso, lavado.id]
    );
  }

  async eliminarLavado(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_LAVADO} WHERE id = ?`, [id]);
  }
  //#endregion

  //#region CRUD Unidad y Retorno
  async obtenerTodasUnidad(): Promise<Unidad[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_UNIDAD}`);
  }

  async insertarUnidad(unidad: Unidad) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_UNIDAD} (id_roperia, nombre_unidad, coordinador, telefono, mail) VALUES (?, ?, ?, ?, ?)`,
      [unidad.id_roperia, unidad.nombre_unidad, unidad.coordinador, unidad.telefono, unidad.mail]
    );
  }

  async actualizarUnidad(unidad: Unidad) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_UNIDAD} SET nombre_unidad = ?, coordinador = ?, telefono = ?, mail = ? WHERE id = ?`,
      [unidad.nombre_unidad, unidad.coordinador, unidad.telefono, unidad.mail, unidad.id]
    );
  }

  async eliminarUnidad(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_UNIDAD} WHERE id = ?`, [id]);
  }

  async obtenerTodasUnidadRetorno(): Promise<Unidad_retorno[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_UNIDAD_RETORNO}`);
  }

  async insertarUnidadRetorno(unidadRetorno: Unidad_retorno) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_UNIDAD_RETORNO} (id_unidad, id_prenda, cantidad_devuelta, fecha_retorno) VALUES (?, ?, ?, ?)`,
      [unidadRetorno.id_unidad, unidadRetorno.id_prenda, unidadRetorno.cantidad_devuelta, unidadRetorno.fecha_retorno]
    );
  }

  async actualizarUnidadRetorno(unidadRetorno: Unidad_retorno) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_UNIDAD_RETORNO} SET id_unidad = ?, id_prenda = ?, cantidad_devuelta = ?, fecha_retorno = ? WHERE id = ?`,
      [unidadRetorno.id_unidad, unidadRetorno.id_prenda, unidadRetorno.cantidad_devuelta, unidadRetorno.fecha_retorno, unidadRetorno.id]
    );
  }

  async eliminarUnidadRetorno(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_UNIDAD_RETORNO} WHERE id = ?`, [id]);
  }
  //#endregion

  //#region CRUD Bajas
  async obtenerTodasBajas(): Promise<Bajas[]> {
    return this.query(`SELECT * FROM ${this.DB_TABLE_BAJAS}`);
  }

  async insertarBajas(baja: Bajas) {
    await this.ejecutar(
      `INSERT INTO ${this.DB_TABLE_BAJAS} (id_prenda, cantidad, detalle, destino, fecha_ingreso) VALUES (?, ?, ?, ?, ?)`,
      [baja.id_prenda, baja.cantidad, baja.detalle, baja.destino, baja.fecha_ingreso]
    );
  }

  async actualizarBajas(baja: Bajas) {
    await this.ejecutar(
      `UPDATE ${this.DB_TABLE_BAJAS} SET id_prenda = ?, cantidad = ?, detalle = ?, destino = ?, fecha_ingreso = ? WHERE id = ?`,
      [baja.id_prenda, baja.cantidad, baja.detalle, baja.destino, baja.fecha_ingreso, baja.id]
    );
  }

  async eliminarBajas(id: number) {
    await this.ejecutar(`DELETE FROM ${this.DB_TABLE_BAJAS} WHERE id = ?`, [id]);
  }
  //#endregion

  //#region Utilidades
  async getRoperiaId(): Promise<number | null> {
    const res = await this.query(`SELECT id FROM ${this.DB_TABLE_ROPERIA} LIMIT 1`);
    return res?.[0]?.id ?? null;
  }

  async depurarTablas(): Promise<void> {
    const tablas = [
      this.DB_TABLE_ROPERIA, this.DB_TABLE_PRENDA, this.DB_TABLE_LAVANDERIA,
      this.DB_TABLE_LAVADO, this.DB_TABLE_UNIDAD, this.DB_TABLE_UNIDAD_RETORNO,
      this.DB_TABLE_BAJAS
    ];
    for (const tabla of tablas) {
      const datos = await this.query(`SELECT * FROM ${tabla}`);
      console.log(`Contenido tabla ${tabla}:`, datos);
    }
  }

  async ejecutarConsulta(sql: string, params: any[] = []): Promise<any> {
    return this.ejecutar(sql, params);
  }
  //#endregion
}
