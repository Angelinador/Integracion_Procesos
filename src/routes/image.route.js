const express = require("express");
const multer = require("multer");
const path = require("path");
const {
    subirImagen,
    encontrarImagen,
    eliminarImagen,
} = require("../controllers/image.controller");

const upload = multer({ dest: path.join(__dirname, "..", "uploads_temp") });
const router = express.Router();

router.post("/subir", upload.single("image"), subirImagen);
router.get("/:idUsuario", encontrarImagen);
router.delete("/:idUsuario", eliminarImagen);

module.exports = router;
