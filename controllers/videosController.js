const Videos = require("../models/videosModel");

exports.listarVideos = async (req, res) => {
  try {
    const { jornada } = req.query;
    const videos = await Videos.listar(jornada);
    res.json(videos);
  } catch (err) {
    console.error("Error al listar videos:", err);
    res.status(500).send(err.message);
  }
};

exports.agregarVideo = async (req, res) => {
  try {
    const { jornada, titulo, url_video } = req.body;

    if (!jornada || !titulo || !url_video) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    await Videos.agregar(jornada, titulo, url_video);
    res.json({ message: "Video agregado ✅" });
  } catch (err) {
    console.error("Error al agregar video:", err);
    res.status(500).json({ error: err.message });
  }
};
