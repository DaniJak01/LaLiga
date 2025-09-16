const express = require("express");
const router = express.Router();
const gruposController = require("../controllers/gruposController");

router.post("/crear", gruposController.crearGrupo);
router.get("/listar", gruposController.listarGrupos);
router.post("/unirse", gruposController.unirseGrupo);
router.get("/:grupo_id", gruposController.verGrupo);

module.exports = router;
