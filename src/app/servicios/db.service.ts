import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Producto } from '../modelo/producto';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  platform: string = "";
  iniciado: boolean = false;

  private readonly DB_NAME = "gestion_roperia";
  private readonly DB_VERSION = 1;
  private readonly DB_ENCRYPTION = false;
  private readonly DB_MODE = "no-encryption";
  private readonly DB_READ_ONLY = false;

  private readonly DB_TABLE_ROPERIA = "roperia";
  private readonly DB_TABLE_LAVANDERIA = "lavanderia";
  private readonly DB_TABLE_UNIDAD = "unidad";
  private readonly DB_TABLE_BAJAS = "bajas";
  private readonly DB_TABLE_FUNCIONARIO = "funcionario";
  private readonly DB_TABLE_ADMIN = "administrador";
  private readonly DB_TABLE_USUARIO = "usuario";

  private readonly DB_SQL_TABLES = `
    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_ROPERIA} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_LAVANDERIA} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_prenda TEXT NOT NULL,
      roperia_id INTEGER NOT NULL,
      FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_UNIDAD} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_prenda TEXT NOT NULL,
      roperia_id INTEGER NOT NULL,
      FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_BAJAS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_prenda TEXT NOT NULL,
      roperia_id INTEGER NOT NULL,
      FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_FUNCIONARIO} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_funcionario TEXT NOT NULL,
      nombre_prenda TEXT NOT NULL,
      roperia_id INTEGER NOT NULL,
      FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_ADMIN} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_admin TEXT NOT NULL,
      rut TEXT NOT NULL,
      password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_USUARIO} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT NOT NULL,
      rut TEXT NOT NULL,
      password TEXT NOT NULL,
      FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE

      );
  `;

  constructor() {}

  async iniciarPlugin() {
    try {
      this.platform = Capacitor.getPlatform();
      if (this.platform == "web") {
        await customElements.whenDefined('jeep-sqlite');
        const jeepSqliteEl = document.querySelector('jeep-sqlite');
        if (jeepSqliteEl) {
          await this.sqlite.initWebStore();
        }
      }
      
      this.db = await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);
      const ret = await this.sqlite.checkConnectionsConsistency();
      const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;      
      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
      } else {
        this.db = await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);
      }
      await this.db.open();
      await this.db.execute(this.DB_SQL_TABLES);
      if (this.platform == "web") {
        await this.sqlite.saveToStore(this.DB_NAME);
      }
      this.iniciado = true;
    } catch (e) {
      console.error(e);
    }
  }

  async cerrarConexion() {
    await this.db.close();
  }

  async obtenerTodos(): Promise<Producto[]> {
    const sql = `SELECT * FROM ${this.DB_TABLE_ROPERIA}`;
    const resultado = (await this.db.query(sql)).values;
    return resultado ?? [];
  }

  async insertar(producto: Producto) {
    const sql = `INSERT INTO ${this.DB_TABLE_ROPERIA} (nombre, descripcion) VALUES (?, ?)`;
    await this.db.run(sql, [producto.nombre, producto.descripcion]);
  }

  async actualizar(producto: Producto) {
    const sql = `UPDATE ${this.DB_TABLE_ROPERIA} SET nombre = ?, descripcion = ? WHERE id = ?`;
    await this.db.run(sql, [producto.nombre, producto.descripcion, producto.id]);
  }

  async eliminar(id: number) {
    const sql = `DELETE FROM ${this.DB_TABLE_ROPERIA} WHERE id = ?`;
    await this.db.run(sql, [id]);
  }

  async insertarLavanderia(nombre_prenda: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_LAVANDERIA} (nombre_prenda, roperia_id) VALUES (?, ?)`;
    await this.db.run(sql, [nombre_prenda, roperia_id]);
  }

  async insertarUnidad(nombre_prenda: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_UNIDAD} (nombre_prenda, roperia_id) VALUES (?, ?)`;
    await this.db.run(sql, [nombre_prenda, roperia_id]);
  }

  async insertarBajas(nombre_prenda: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_BAJAS} (nombre_prenda, roperia_id) VALUES (?, ?)`;
    await this.db.run(sql, [nombre_prenda, roperia_id]);
  }

  async insertarFuncionario(nombre_funcionario: string, nombre_prenda: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_FUNCIONARIO} (nombre_funcionario, nombre_prenda, roperia_id) VALUES (?, ?, ?)`;
    await this.db.run(sql, [nombre_funcionario, nombre_prenda, roperia_id]);
  }
  async insertarUsuario(nombre_funcionario: string, rut: string, password: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_USUARIO} (nombre_funcionario, rut, password, roperia_id) VALUES (?, ?, ?,?)`;
    await this.db.run(sql, [nombre_funcionario, rut, password, roperia_id]);
  }
  async insertarAdmin(nombre_admin: string, rut: string, password: string,) {
    const sql = `INSERT INTO ${this.DB_TABLE_ADMIN} (nombre_admin, rut, password) VALUES (?, ?,?)`;
    await this.db.run(sql, [nombre_admin, rut, password]);
  }

}

