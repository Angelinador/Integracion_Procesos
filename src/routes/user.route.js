const {
    crearUsuario,
    encontrarUsuario,
    encontrarUsuarios,
    actualizarUsuario,
    eliminarUsuario
} = require("../controllers/user.controller");
const express = require("express");

const router = express.Router();

router.post("/", crearUsuario);
router.get("/", encontrarUsuarios);
router.get("/:id", encontrarUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;
