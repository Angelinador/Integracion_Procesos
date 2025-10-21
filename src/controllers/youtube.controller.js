const YouTubeService = require("../services/youtube.service");

const buscarVideos = async (req, res) => {
    try {
        const query = req.query.q;
        const videos = await YouTubeService.buscarVideos(query);
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const obtenerVideo = async (req, res) => {
    try {
        const id = req.params.id;
        const video = await YouTubeService.obtenerVideoPorId(id);
        res.json({ success: true, data: video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const buscarVideosCercanos = async (req, res) => {
    try {
        const { q, lat, lon } = req.query;
        const videos = await YouTubeService.buscarVideosPorUbicacion(q, lat, lon);
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const buscarVideosCercanosPopulares = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        const videos = await YouTubeService.buscarVideosPopulares(lat, lon);
        res.json({ success: true, data: videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    buscarVideos,
    obtenerVideo,
    buscarVideosCercanos,
    buscarVideosCercanosPopulares
};
