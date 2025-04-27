import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Lavanderia, Producto } from '../modelo/producto';
import { Capacitor } from '@capacitor/core';
import * as bcrypt from 'bcryptjs';
@Injectable({
  providedIn: 'root'
})
export class DbService {

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  platform: string = "";
  iniciado: boolean = false;

  private readonly DB_NAME = "adminRopa";
  private readonly DB_VERSION = 1;
  private readonly DB_ENCRYPTION = false;
  private readonly DB_MODE = "no-encryption";
  private readonly DB_READ_ONLY = false;

  private readonly DB_TABLE_USUARIO = "usuario";
  private readonly DB_TABLE_ROPERIA = "roperia";
  private readonly DB_TABLE_LAVANDERIA = "lavanderia";
  private readonly DB_TABLE_UNIDAD = "unidad";
  private readonly DB_TABLE_BAJAS = "bajas";
  private readonly DB_TABLE_FUNCIONARIO = "funcionario";
  private readonly DB_TABLE_ADMIN = "administrador";
  

  private readonly DB_SQL_TABLES = `
   CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_USUARIO} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario TEXT NOT NULL,
    rut TEXT NOT NULL,
    password TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_ROPERIA} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES ${this.DB_TABLE_USUARIO} (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_LAVANDERIA} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prenda TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    roperia_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE,
     FOREIGN KEY (usuario_id) REFERENCES ${this.DB_TABLE_USUARIO} (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_UNIDAD} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prenda TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    roperia_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES ${this.DB_TABLE_USUARIO} (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_BAJAS} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prenda TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    roperia_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES ${this.DB_TABLE_USUARIO} (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_FUNCIONARIO} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_funcionario TEXT NOT NULL,
    nombre_prenda TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    roperia_id INTEGER NOT NULL,
    FOREIGN KEY (roperia_id) REFERENCES ${this.DB_TABLE_ROPERIA} (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_ADMIN} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_admin TEXT NOT NULL,
    rut TEXT NOT NULL,
    password TEXT NOT NULL
  );

 
`;


  constructor() {}

  async iniciarPlugin() {
    try {
        this.platform = Capacitor.getPlatform();

        if (!this.sqlite) {
            console.error("🚨 SQLite no está inicializado correctamente.");
            return;
        }

        if (this.platform === "web") {
            await customElements.whenDefined('jeep-sqlite');
            const jeepSqliteEl = document.querySelector('jeep-sqlite');
            if (jeepSqliteEl) {
                await this.sqlite.initWebStore();
            }
        }

        console.log("🔹 Creando conexión con la base de datos...");
        this.db = await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);

        const ret = await this.sqlite.checkConnectionsConsistency();
        const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;

        if (ret.result && isConn) {
            this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
        } else {
            this.db = await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);
        }

        await this.db.open();
        console.log("✅ Base de datos abierta correctamente.");

        console.log("📌 Creando tablas...");
        await this.db.execute(this.DB_SQL_TABLES).catch(err => {
            console.error("🚨 Error creando tablas:", err);
        });

        // Insertar un usuario por defecto si no existe
        const usuario = await this.getUsuarioPorRut('12345678-9');
        if (!usuario) {
            console.log("No hay usuario. Creando uno por defecto...");
            const hashedPassword = await bcrypt.hash('default_password', 10);
            await this.db.run(`INSERT INTO ${this.DB_TABLE_USUARIO} (nombre_usuario, rut, password) VALUES ('Usuario Default', '12345678-9', ?)`, [hashedPassword]);
        }

        // Insertar una ropería por defecto si no existe
        const roperia = await this.getRoperiaId();
        if (!roperia) {
            console.log("No hay ropería. Creando una por defecto...");
            const usuarioId = (await this.db.query(`SELECT id FROM ${this.DB_TABLE_USUARIO} LIMIT 1`)).values?.[0]?.id;
            if (!usuarioId) {
                throw new Error("No se pudo encontrar un usuario para asociar con la ropería.");
            }
            await this.db.run(`INSERT INTO ${this.DB_TABLE_ROPERIA} (nombre, descripcion, cantidad, usuario_id) VALUES ('Sabanas', 'blancas con logo', 1500, ?)`, [usuarioId]);
        }

        if (this.platform === "web") {
            await this.sqlite.saveToStore(this.DB_NAME);
        }

        this.iniciado = true;
        console.log("🎉 Base de datos inicializada con éxito.");

        // Llamar a depurarTablas para verificar el contenido de las tablas
        await this.depurarTablas();
    } catch (e) {
        console.error("🚨 Error al inicializar la base de datos:", e);
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
    const sql = `INSERT INTO ${this.DB_TABLE_ROPERIA} (nombre, descripcion, cantidad) VALUES (?,?,?)`;
    await this.db.run(sql, [producto.nombre, producto.descripcion, producto.cantidad,]);
  }

  async actualizar(producto: Producto) {
    const sql = `UPDATE ${this.DB_TABLE_ROPERIA} SET nombre = ?, descripcion = ?, cantidad = ? WHERE id = ?`;
    await this.db.run(sql, [producto.nombre, producto.descripcion, producto.cantidad, producto.id]);
  }

  async eliminar(id: number) {
    const sql = `DELETE FROM ${this.DB_TABLE_ROPERIA} WHERE id = ?`;
    await this.db.run(sql, [id]);
  }
 
  async insertarRopaLavanderia(producto: Lavanderia) {
    const sql = `INSERT INTO ${this.DB_TABLE_LAVANDERIA} (nombre_prenda, cantidad, roperia_id) VALUES (?, ?, ?)`;
    await this.db.run(sql, [producto.nombre_prenda, producto.cantidad, producto.roperia_id]);
  }
  async actualizarLavanderia(producto: Lavanderia) {
    const sql = `UPDATE ${this.DB_TABLE_LAVANDERIA} SET nombre_prenda = ?, cantidad = ?, roperia_id = ? WHERE id = ?`;
    await this.db.run(sql, [producto.nombre_prenda, producto.cantidad, producto.roperia_id, producto.id]);
  }
  
  async obtenerTodosLavanderia(): Promise<Lavanderia[]> {
    const sql = `SELECT * FROM ${this.DB_TABLE_LAVANDERIA}`;
    const resultado = (await this.db.query(sql)).values;
    return resultado ?? [];
  }

  async eliminarLavanderia(id: number) {
    const sql = `DELETE FROM ${this.DB_TABLE_LAVANDERIA} WHERE id = ?`;
    await this.db.run(sql, [id]);
  }
  async insertarRopaUnidad(nombre_prenda: string, cantidad: number, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_UNIDAD} (nombre_prenda, cantidad, roperia_id) VALUES (?, ?, ?)`;
    await this.db.run(sql, [nombre_prenda, cantidad, roperia_id]);
  }

  async insertarBajas(nombre_prenda: string, cantidad: number, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_BAJAS} (nombre_prenda, cantidad, roperia_id) VALUES (?, ?, ?)`;
    await this.db.run(sql, [nombre_prenda, cantidad, roperia_id]);
  }

  async insertarFuncionario(nombre_funcionario: string, nombre_prenda: string, roperia_id: number) {
    const sql = `INSERT INTO ${this.DB_TABLE_FUNCIONARIO} (nombre_funcionario, nombre_prenda, roperia_id) VALUES (?, ?, ?)`;
    await this.db.run(sql, [nombre_funcionario, nombre_prenda, roperia_id]);
  }
  async insertarUsuario(nombre_usuario: string, rut: string, password: string) {
    try {
        // Verificar si existe una ropería
        let resultado = await this.db.query(`SELECT id FROM ${this.DB_TABLE_ROPERIA} LIMIT 1`);
        let roperiaId: number;

        if (!resultado.values || resultado.values.length === 0) {
            // No hay ropería, creamos una por defecto
            console.log("No hay ropería. Creando una por defecto...");
            await this.db.run(`INSERT INTO ${this.DB_TABLE_ROPERIA} (nombre, descripcion, cantidad, usuario_id) VALUES ('Ropería Central', 'Ropa hospitalaria', 100, 1)`);

            // Obtener el ID de la nueva ropería
            resultado = await this.db.query(`SELECT id FROM ${this.DB_TABLE_ROPERIA} LIMIT 1`);
        }

        // Guardamos el ID de la ropería
        roperiaId = resultado.values?.[0]?.id;

        if (!roperiaId) {
            throw new Error("No se pudo crear o encontrar una ropería.");
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario con la ropería recién creada o existente
        const sql = `INSERT INTO ${this.DB_TABLE_USUARIO} (nombre_usuario, rut, password) VALUES (?, ?, ?)`;
        await this.db.run(sql, [nombre_usuario, rut, hashedPassword]);

        console.log("✅ Usuario agregado correctamente con ropería asociada.");
    } catch (error) {
        console.error("🚨 Error al insertar usuario:", error);
    }
}
  
  async insertarAdmin(nombre_admin: string, rut: string, password: string,) {
    const sql = `INSERT INTO ${this.DB_TABLE_ADMIN} (nombre_admin, rut, password) VALUES (?, ?,?)`;
    await this.db.run(sql, [nombre_admin, rut, password]);
  }
  
  async getUsuarioPorRut(rut: string): Promise<any> {
  
    try {
      // 💡 Si this.db es undefined, inicializa la base de datos
      if (!this.db) {
        console.warn('⚠️ Base de datos no inicializada. Inicializando ahora...');
        await this.iniciarPlugin(); // Asegura que la base de datos esté lista
      }
  
      const sql = `SELECT * FROM ${this.DB_TABLE_USUARIO} WHERE rut = ? LIMIT 1`;
      const resultado = (await this.db.query(sql, [rut])).values ?? [];
      
      if (resultado.length > 0) {
        return resultado[0];
      } else {
        console.log('Usuario no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener usuario por RUT:', error);
      return null;
    }
  }
  
  async obtenerTodosUsuarios(): Promise<any[]> {
    const sql = `SELECT * FROM ${this.DB_TABLE_USUARIO}`;
    const resultado = (await this.db.query(sql)).values;
    return resultado ?? [];
  }
  async eliminarUsuario(id: number) {
    const sql = `DELETE FROM ${this.DB_TABLE_USUARIO} WHERE id = ?`;
    await this.db.run(sql, [id]);
  }
  async getRoperiaId(): Promise<number | null> {
    try {
        const resultado = await this.db.query(`SELECT id FROM ${this.DB_TABLE_ROPERIA} LIMIT 1`);
        if (resultado.values && resultado.values.length > 0) {
            return resultado.values[0].id; // Devuelve el ID de la primera ropería encontrada
        }
        return null; // No hay roperías disponibles
    } catch (error) {
        console.error("🚨 Error al obtener el ID de la ropería:", error);
        return null;
    }
}
  
async depurarTablas() {
  try {
      const tablas = ['usuario', 'roperia'];
      for (const tabla of tablas) {
          const resultado = await this.db.query(`SELECT * FROM ${tabla}`);
          console.log(`Contenido de la tabla ${tabla}:`, resultado.values);
      }
  } catch (error) {
      console.error("🚨 Error al depurar tablas:", error);
  }
}

}


