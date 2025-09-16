const Noticias = require("../models/noticiasModel");

exports.listarNoticias = async (req, res) => {
  try {
    const { jornada } = req.query;
    const noticias = await Noticias.listar(jornada);
    res.json(noticias);
  } catch (err) {
    console.error("Error al listar noticias:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.agregarNoticia = async (req, res) => {
  try {
    const { jornada, titulo, contenido, url_fuente } = req.body;

    if (!jornada || !titulo) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await Noticias.agregar(
      jornada,
      titulo,
      contenido || null,
      url_fuente || null
    );
    res.json({ message: "Noticia agregada ✅" });
  } catch (err) {
    console.error("Error al agregar noticia:", err);
    res.status(500).json({ error: err.message });
  }
};
