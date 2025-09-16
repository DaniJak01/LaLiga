const db = require("../config/db");

const Grupos = {
  // Obtener max id del grupo
  obtenerMaxId: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT MAX(grupo_id) as maxId FROM grupos", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  // Crear el grupo
  crear: (grupo_id, grupo_nombre, bote, codigo) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO grupos (grupo_id, grupo_nombre, bote, codigo) VALUES (?, ?, ?, ?)",
        [grupo_id, grupo_nombre, bote, codigo],
        (err) => (err ? reject(err) : resolve())
      );
    });
  },
  // Crear la instancia del grupo
  crearInstancia: (grupo_id, usuario_id, admin) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO grupo_instance (grupo_id, usuario_id, admin) VALUES (?, ?, ?)",
        [grupo_id, usuario_id, admin],
        (err) => (err ? reject(err) : resolve())
      );
    });
  },
  // Listar todos los grupos de un usuario
  listar: (usuario_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT g.*, gi.admin 
         FROM grupos g 
         JOIN grupo_instance gi ON g.grupo_id = gi.grupo_id 
         WHERE gi.usuario_id = ?`,
        [usuario_id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });
  },
  // Obtener jugadores de un grupo
  obtenerJugadores: (grupo_id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT u.id, u.nombre, u.equipo_favorito, gi.admin
       FROM usuarios u
       JOIN grupo_instance gi ON u.id = gi.usuario_id
       WHERE gi.grupo_id = ?`,
        [grupo_id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    }),
  // Unirse a un grupo por código
  unirsePorCodigo: async (codigo, usuario_id) => {
    // Buscar grupo
    const grupos = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM grupos WHERE codigo = ?",
        [codigo],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
    if (grupos.length === 0) throw new Error("Grupo no encontrado");

    const grupo_id = grupos[0].grupo_id;

    // Verificar si ya está
    const existe = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM grupo_instance WHERE grupo_id = ? AND usuario_id = ?",
        [grupo_id, usuario_id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });
    if (existe.length > 0) throw new Error("Ya estás en el grupo");

    // Insertar usuario
    await Grupos.crearInstancia(grupo_id, usuario_id, false);
    return grupos[0];
  },
};

module.exports = Grupos;
