const express = require("express");
const {
    crearVideoReferencia,
    obtenerReferencia,
    obtenerReferencias
} = require("../controllers/videoReference.controller");

const router = express.Router();

router.post("/", crearVideoReferencia);
router.get("/", obtenerReferencias);
router.get("/:id", obtenerReferencia);

module.exports = router;
