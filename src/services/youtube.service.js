// services/youtube.service.js
const axios = require("axios");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const YouTubeService = {
    // Busqueda de videos por palabras claves
    async buscarVideos(query, maxResults = 10) {
        try {
            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: "snippet",
                    q: query,
                    maxResults,
                    key: YOUTUBE_API_KEY,
                    type: "video",
                },
            });

            // Transformar los resultados para simplificar la respuesta
            const videos = response.data.items.map((item) => ({
                id: item.id.videoId,
                titulo: item.snippet.title,
                descripcion: item.snippet.description,
                canal: item.snippet.channelTitle,
                miniatura: item.snippet.thumbnails.medium.url,
                publicado: item.snippet.publishedAt,
            }));

            return videos;
        } catch (error) {
            throw new Error("No se pudieron obtener videos de YouTube");
        }
    },

    // Obtencion de info de video por ID
    async obtenerVideoPorId(videoId) {
        try {
            const response = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videoId,
                    key: YOUTUBE_API_KEY,
                },
            });

            const video = response.data.items[0];
            return {
                id: video.id,
                titulo: video.snippet.title,
                descripcion: video.snippet.description,
                canal: video.snippet.channelTitle,
                miniatura: video.snippet.thumbnails.high.url,
                vistas: video.statistics.viewCount,
                likes: video.statistics.likeCount,
                duracion: video.contentDetails.duration,
            };
        } catch (error) {
            throw new Error("No se pudo obtener el video de YouTube");
        }
    },

    // Obtener videos populares por coordenadas
    async buscarVideosPorUbicacion(query = "", lat, lon, radio = "10km", maxResults = 10) {
        try {
            // Validación de parámetros
            if (!lat || !lon) {
                throw new Error("Debes proporcionar coordenadas válidas (lat y lon)");
            }

            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: "snippet",
                    type: "video",
                    q: query,
                    location: `${lat},${lon}`,
                    locationRadius: radio,
                    maxResults,
                    key: YOUTUBE_API_KEY,
                },
            });

            if (!response.data || !response.data.items) {
                console.error("Respuesta vacía de la API:", response.data);
                throw new Error("Respuesta inválida de la API de YouTube");
            }

            return response.data.items.map((item) => ({
                id: item.id.videoId,
                titulo: item.snippet.title,
                descripcion: item.snippet.description,
                idCanal: item.snippet.channelId,
                canal: item.snippet.channelTitle,
                miniatura: item.snippet.thumbnails?.medium?.url,
                publicado: item.snippet.publishedAt,
                ubicacion: { lat, lon, radio },
            }));
        } catch (error) {
            throw new Error("No se pudieron obtener videos cercanos");
        }
    },

    // Obtener videos más populares cerca de coordenadas
    async buscarVideosPopulares(lat, lon, radio = "10km", maxResults = 10) {
        try {
            if (!lat || !lon) {
                throw new Error("Debes proporcionar coordenadas válidas (lat y lon)");
            }

            const response = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: "snippet",
                    type: "video",
                    location: `${lat},${lon}`,
                    locationRadius: radio,
                    order: "viewCount",
                    maxResults,
                    key: YOUTUBE_API_KEY,
                },
            });

            if (!response.data?.items) {
                throw new Error("Respuesta inválida de la API de YouTube");
            }

            return response.data.items.map((item) => ({
                id: item.id.videoId,
                titulo: item.snippet.title,
                descripcion: item.snippet.description,
                canal: item.snippet.channelTitle,
                miniatura: item.snippet.thumbnails?.medium?.url,
                publicado: item.snippet.publishedAt,
                ubicacion: { lat, lon, radio },
            }));
        } catch (error) {
            throw new Error("No se pudieron obtener videos populares");
        }
    }

};

module.exports = YouTubeService;
