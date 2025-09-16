const db = require("../config/db");

const Videos = {
  listar: (jornada = null) =>
    new Promise((resolve, reject) => {
      let sql = "SELECT * FROM videos";
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

  agregar: (jornada, titulo, url_video) =>
    new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO videos (jornada, titulo, url_video) VALUES (?, ?, ?)",
        [jornada, titulo, url_video],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    }),
};

module.exports = Videos;
