import { Prenda } from '../model/prenda';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private sqlite:SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  private db!:SQLiteDBConnection
  platform: string = "";
  iniciado:boolean = false; 
  
  private readonly DB_NAME        = "roperia"
  private readonly DB_VERSION     = 1
  private readonly DB_ENCRYPTION  = false
  private readonly DB_MODE        = "no-encryption"
  private readonly DB_READ_ONLY   = false

  private readonly DB_TABLE_NAME = "prendas"
  private readonly DB_COL_ID    = "id"
  private readonly DB_COL_NAME  = "nombre"
  private readonly DB_COL_CANT  = "cantidad"
  private readonly DB_COL_DESC  = "descripcion"

  private readonly DB_SQL_TABLES = `
    CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_NAME}(
      ${this.DB_COL_ID} INTEGER PRIMARY KEY AUTOINCREMENT,
      ${this.DB_COL_NAME} TEXT NOT NULL,
      ${this.DB_COL_CANT} INTEGER DEFAULT 0,
      ${this.DB_COL_DESC} TEXT NOT NULL
    );
  `
  

  constructor() {}

  async iniciarPlugin() {
    try {
      console.log("DbService::iniciarPlugin")
      this.platform = Capacitor.getPlatform()
  
      console.log("DbService::iniciarPlugin plataform=" + this.platform)
      if(this.platform == "web") {        
        await customElements.whenDefined('jeep-sqlite')   
        console.log("Estado del DOM antes de buscar jeep-sqlite:", document.body.innerHTML);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        const jeepSqliteEl = document.querySelector('jeep-sqlite')//aca no toma jeep-sqlite
        if(jeepSqliteEl != null) {
          console.log("DbService::iniciarPlugin::initWebStore")
          await this.sqlite.initWebStore()
        }
        else {
          throw new Error("El elemento jeep-sqlite no está presente en el DOM.");
        }
      }
  
      console.log("sqlite::createConnection()")
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRYPTION,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      )
      console.dir(this.db)    
  
      console.log("db.open()")      
      const ret = await this.sqlite.checkConnectionsConsistency()
      const isConn = (await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)).result;      
      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection(this.DB_NAME, this.DB_READ_ONLY);
      } else {
        this.db = await this.sqlite.createConnection(this.DB_NAME, this.DB_ENCRYPTION, this.DB_MODE, this.DB_VERSION, this.DB_READ_ONLY);
      }    

      await this.db.open() 
      console.dir(this.db)    
  
      console.log("db.execute(SQL_TABLES)")
      console.log(this.DB_SQL_TABLES)
      await this.db.execute(this.DB_SQL_TABLES)
  
      await this.insertar({
        nombre: "sabana",
        cantidad: 3,
        descripcion: "blanca"

      })
      await this.insertar({
        nombre: "campo verde",
        cantidad: 6,
        descripcion: "verde"
      })

      if(this.platform == "web") {
        console.log("DbService::iniciarPlugin::saveStore()")
        await this.sqlite.saveToStore(this.DB_NAME)
      }
      this.iniciado = true 
    } catch(e) {
      console.error("Error al iniciar el plugin: ", e);
    }
    
  }
  async obtenerTodos():Promise<Prenda[]> {
    if (!this.iniciado) {
      console.error("La base de datos no ha sido inicializada.");
      return [];
    }
    
    const sql = `SELECT * FROM ${this.DB_TABLE_NAME}`
    console.log(sql)
    console.dir(this.db)
    const resultado = (await this.db.query(sql)).values       
    console.dir(resultado) 
    return resultado ?? []
  }
  async cerrarConexion() {
    await this.db.close() 
  }



  async insertar(prenda:Prenda) {
    const sql = `INSERT INTO ${this.DB_TABLE_NAME}(${this.DB_COL_NAME}, ${this.DB_COL_CANT}, ${this.DB_COL_DESC}) VALUES(?,?,?)`
    await this.db.run(sql, [prenda.nombre, prenda.cantidad, prenda.descripcion])
  }

  async actualizar(prenda:Prenda) {
    const sql = `UPDATE ${this.DB_TABLE_NAME} SET ${this.DB_COL_CANT} = ? WHERE ${this.DB_COL_ID} = ?`
    await this.db.run(sql, [prenda.cantidad, prenda.id])
  }

  async eliminar(id:number) {
    const sql = `DELETE FROM ${this.DB_TABLE_NAME} WHERE ${this.DB_COL_ID} = ?`
    await this.db.run(sql, [id])
  }

}
