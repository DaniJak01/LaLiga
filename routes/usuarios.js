const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

router.post("/register", usuariosController.registrar);
router.post("/login", usuariosController.login);
router.get("/usuarios", usuariosController.listar);

module.exports = router;
