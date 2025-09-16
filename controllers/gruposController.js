const Grupos = require("../models/gruposModel");

exports.crearGrupo = async (req, res) => {
  try {
    const { grupo_nombre, usuario_id } = req.body;
    if (!grupo_nombre || !usuario_id)
      return res.status(400).send("Faltan datos");

    const maxId = await Grupos.obtenerMaxId();
    const grupo_id = maxId + 1;
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bote = 0;
    const admin = true;

    await Grupos.crear(grupo_id, grupo_nombre, bote, codigo);
    await Grupos.crearInstancia(grupo_id, usuario_id, admin);

    res.json({ message: "Grupo creado ✅", grupo_id, codigo, bote });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.listarGrupos = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).send("Falta usuario_id");

    const grupos = await Grupos.listar(usuario_id);
    res.json(grupos);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.verGrupo = async (req, res) => {
  try {
    const { grupo_id } = req.params;
    if (!grupo_id) return res.status(400).send("Falta grupo_id");

    const jugadores = await Grupos.obtenerJugadores(grupo_id);

    const grupo =
      jugadores.length > 0
        ? {
            grupo_id: jugadores[0].grupo_id,
            grupo_nombre: jugadores[0].grupo_nombre,
            bote: jugadores[0].bote,
            codigo: jugadores[0].codigo,
          }
        : null;

    res.json({ grupo, jugadores });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.unirseGrupo = async (req, res) => {
  try {
    const { codigo, usuario_id } = req.body;
    if (!codigo || !usuario_id) return res.status(400).send("Faltan datos");

    const grupo = await Grupos.unirsePorCodigo(codigo, usuario_id);
    res.json({ message: "Te uniste al grupo ✅", grupo });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
};
