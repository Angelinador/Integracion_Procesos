const express = require("express");
const router = express.Router();
const { 
    buscarVideos, 
    obtenerVideo, 
    buscarVideosCercanos,
    buscarVideosCercanosPopulares
} = require("../controllers/youtube.controller");

router.get("/buscar", buscarVideos);
router.get("/cercanos", buscarVideosCercanos);
router.get("/populares", buscarVideosCercanosPopulares); 
router.get("/:id", obtenerVideo);

module.exports = router;
