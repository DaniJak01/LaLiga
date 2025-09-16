const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "laliga",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err);
    return;
  }
  console.log("✅ Conectado a MySQL");
});

module.exports = db;
