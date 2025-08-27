import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'clave-secreta';

app.use(cors());
app.use(express.json());

// Abrir DB
const dbPromise = open({
  filename: './adminRopa.db',
  driver: sqlite3.Database
});

// Crear tabla usuario si no existe
(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT NOT NULL,
      rut TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT
    );
  `);
})();

// Middleware de autenticación JWT
function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(403).json({ error: 'Token requerido' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

// Registro
app.post('/register', async (req, res) => {
  const { nombre_usuario, rut, password, role } = req.body;
  const db = await dbPromise;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO usuario (nombre_usuario, rut, password, role) VALUES (?, ?, ?, ?)',
      [nombre_usuario, rut, hashed, role]
    );
    res.json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(400).json({ error: 'El usuario ya existe o datos inválidos' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { rut, password } = req.body;
  const db = await dbPromise;
  const user = await db.get('SELECT * FROM usuario WHERE rut = ?', [rut]);

  if (!user) {
    return res.status(401).json({ error: 'Usuario no encontrado' });
  }

  const valido = await bcrypt.compare(password, user.password);
  if (!valido) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign(
    { id: user.id, rut: user.rut, role: user.role },
    SECRET_KEY,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

// Obtener info de usuario
app.get('/usuario-info', authMiddleware, async (req, res) => {
  const db = await dbPromise;
  const user = await db.get(
    'SELECT id, nombre_usuario, rut, role FROM usuario WHERE id = ?',
    [req.user.id]
  );
  res.json({ user });
});

// Actualizar usuario
app.put('/usuario/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nombre_usuario, rut, password, role } = req.body;
  const db = await dbPromise;

  try {
    const user = await db.get('SELECT * FROM usuario WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let hashed = user.password;
    if (password) {
      hashed = await bcrypt.hash(password, 10);
    }

    await db.run(
      'UPDATE usuario SET nombre_usuario = ?, rut = ?, password = ?, role = ? WHERE id = ?',
      [nombre_usuario ?? user.nombre_usuario, rut ?? user.rut, hashed, role ?? user.role, id]
    );

    const updatedUser = await db.get('SELECT id, nombre_usuario, rut, role FROM usuario WHERE id = ?', [id]);
    res.json({ message: 'Usuario actualizado', user: updatedUser });
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
app.delete('/usuario/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;
  try {
    const user = await db.get('SELECT * FROM usuario WHERE id = ?', [id]);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await db.run('DELETE FROM usuario WHERE id = ?', [id]);
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar usuario' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
