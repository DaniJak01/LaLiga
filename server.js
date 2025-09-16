const express = require("express");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.static("public"));

// Rutas
const usuariosRoutes = require("./routes/usuarios");
app.use("/usuarios", usuariosRoutes);
const gruposRoutes = require("./routes/grupos");
app.use("/grupos", gruposRoutes);
const videosRoutes = require("./routes/videos");
app.use("/videos", videosRoutes);
const noticiasRoutes = require("./routes/noticias");
app.use("/noticias", noticiasRoutes);
const comentariosRoutes = require("./routes/comentarios");
app.use("/comentarios", comentariosRoutes);

// app.listen(3000, () => {
//   console.log("🚀 Servidor en http://localhost:3000");
// });

app.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Servidor en http://0.0.0.0:3000");
});
