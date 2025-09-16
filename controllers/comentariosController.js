const Comentarios = require("../models/comentariosModel");

exports.listarComentarios = async (req, res) => {
  try {
    const { noticia_id, video_id } = req.query;
    let comentarios;

    if (noticia_id) {
      comentarios = await Comentarios.listar("noticia", noticia_id);
    } else if (video_id) {
      comentarios = await Comentarios.listar("video", video_id);
    } else {
      return res.status(400).send("Debes indicar noticia_id o video_id");
    }

    res.json(comentarios);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.agregarComentario = async (req, res) => {
  try {
    const { usuario_id, noticia_id, video_id, texto } = req.body;
    if (!usuario_id || !texto || !texto.trim()) {
      return res.status(400).send("Faltan datos");
    }

    let result;
    if (noticia_id) {
      result = await Comentarios.agregar(
        usuario_id,
        "noticia",
        noticia_id,
        texto
      );
    } else if (video_id) {
      result = await Comentarios.agregar(usuario_id, "video", video_id, texto);
    } else {
      return res.status(400).send("Debes indicar noticia_id o video_id");
    }

    res.json({
      message: "Comentario agregado ✅",
      comentario_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
