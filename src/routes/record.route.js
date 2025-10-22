const express = require("express");
const {
  crearHistorial,
  obtenerHistorial,
  obtenerHistoriales,
  referenciasPorHistorial
} = require("../controllers/record.controller");

const router = express.Router();

router.post("/", crearHistorial);
router.get("/", obtenerHistoriales);
router.get("/:idUsuario", obtenerHistorial);

// servicio que consumira la screen de historial en RN
router.get("/:idHistorial/referencias", referenciasPorHistorial);

module.exports = router;
