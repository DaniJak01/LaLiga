const db = require("../config/db");

const Noticias = {
  listar: (jornada = null) =>
    new Promise((resolve, reject) => {
      let sql = "SELECT * FROM Noticias";
      const params = [];

      if (jornada) {
        sql += " WHERE jornada = ?";
        params.push(jornada);
      }

      sql += " ORDER BY fecha_creacion DESC";

      db.query(sql, params, (err, results) =>
        err ? reject(err) : resolve(results)
      );
    }),

  agregar: (jornada, titulo, contenido, url_fuente) =>
    new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Noticias (jornada, titulo, contenido, url_fuente) VALUES (?, ?, ?, ?)",
        [jornada, titulo, contenido, url_fuente],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    }),
};

module.exports = Noticias;
