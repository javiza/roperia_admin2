const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');

async function seed() {
  const db = await open({
    filename: './adminRopa.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT NOT NULL,
      rut TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT
    )
  `);

  const usuarios = await db.all('SELECT * FROM usuario');
  if (usuarios.length > 0) {
    console.log('Usuarios ya existen');
    return;
  }

  const hashedAdmin = await bcrypt.hash('admin123', 10);
  await db.run(
    'INSERT INTO usuario (nombre_usuario, rut, password, role) VALUES (?, ?, ?, ?)',
    ['Administrador', '11111111-1', hashedAdmin, 'admin']
  );

  const hashedUser = await bcrypt.hash('usuario123', 10);
  await db.run(
    'INSERT INTO usuario (nombre_usuario, rut, password, role) VALUES (?, ?, ?, ?)',
    ['Usuario Normal', '22222222-2', hashedUser, 'usuario']
  );

  console.log('Usuarios creados correctamente');
  await db.close();
}

seed();
