const express = require("express");
const router = express.Router();
const noticiasController = require("../controllers/noticiasController");

router.get("/", noticiasController.listarNoticias);
router.post("/", noticiasController.agregarNoticia);

module.exports = router;
