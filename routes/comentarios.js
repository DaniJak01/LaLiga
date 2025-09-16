const express = require("express");
const router = express.Router();
const comentariosController = require("../controllers/comentariosController");

router.get("/", comentariosController.listarComentarios);
router.post("/", comentariosController.agregarComentario);

module.exports = router;
