const bcrypt = require("bcrypt");
const Usuarios = require("../models/usuariosModel");

exports.registrar = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      equipo_favorito,
      sexo,
      telefono,
      cumpleaños,
    } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const existingUser = await Usuarios.buscarPorEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuarios.crear({
      nombre,
      email,
      password: hash,
      equipo_favorito: equipo_favorito || null,
      sexo: sexo || null,
      telefono: telefono || null,
      cumpleaños: cumpleaños || null,
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuarios.buscarPorEmail(email);

    if (!usuario) return res.status(401).send("Usuario no encontrado");

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).send("Contraseña incorrecta");

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      equipo_favorito: usuario.equipo_favorito,
      sexo: usuario.sexo,
      telefono: usuario.telefono,
      cumpleaños: usuario.cumpleaños,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).send("Error en login");
  }
};

exports.listar = async (req, res) => {
  try {
    const users = await Usuarios.listar();
    res.json(users);
  } catch (err) {
    console.error("Error al listar usuarios:", err);
    res.status(500).send("Error al obtener usuarios");
  }
};
