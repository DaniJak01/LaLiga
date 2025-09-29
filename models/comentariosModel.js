const db = require("../config/db");

const Comentarios = {
  listar: (tipo, id) =>
    new Promise((resolve, reject) => {
      const columna = tipo === "noticia" ? "noticia_id" : "video_id";
      db.query(
        `SELECT c.comentario_id, c.texto, u.nombre AS usuario, c.fecha_creacion
         FROM Comentarios c
         JOIN Usuarios u ON c.usuario_id = u.id
         WHERE c.${columna} = ?
         ORDER BY c.fecha_creacion DESC`,
        [id],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    }),

  agregar: (usuario_id, tipo, id, texto) =>
    new Promise((resolve, reject) => {
      const columna = tipo === "noticia" ? "noticia_id" : "video_id";
      db.query(
        `INSERT INTO Comentarios (usuario_id, ${columna}, texto, fecha_creacion)
         VALUES (?, ?, ?, NOW())`,
        [usuario_id, id, texto],
        (err, result) =>
          err ? reject(err) : resolve({ insertId: result.insertId })
      );
    }),
};

module.exports = Comentarios;
