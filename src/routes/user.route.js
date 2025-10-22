const {
    crearUsuario,
    encontrarUsuario,
    encontrarUsuarios,
    actualizarUsuario,
    eliminarUsuario,
    encontrarIdUsuario
} = require("../controllers/user.controller");
const express = require("express");

const router = express.Router();

router.post("/", crearUsuario);
router.get("/", encontrarUsuarios);
router.get("/:id", encontrarUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.delete("/id/:correoElectronico", encontrarIdUsuario);

module.exports = router;
