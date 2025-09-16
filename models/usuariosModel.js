const db = require("../config/db");

const Usuarios = {
  crear: ({
    nombre,
    email,
    password,
    equipo_favorito,
    sexo,
    telefono,
    cumpleaños,
  }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO Usuarios 
       (nombre, email, password, equipo_favorito, sexo, telefono, cumpleaños) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nombre, email, password, equipo_favorito, sexo, telefono, cumpleaños],
        (err, result) => {
          if (err) return reject(err);
          // Devuelvo el insertId y los datos
          resolve({
            id: result.insertId,
            nombre,
            email,
            equipo_favorito,
            sexo,
            telefono,
            cumpleaños,
          });
        }
      );
    });
  },

  buscarPorEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM Usuarios WHERE email = ?",
        [email],
        (err, results) => (err ? reject(err) : resolve(results[0] || null))
      );
    });
  },

  listar: () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id, nombre, email, equipo_favorito, sexo, telefono, cumpleaños FROM Usuarios",
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });
  },
};

module.exports = Usuarios;
