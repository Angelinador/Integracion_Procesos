// services/youtube.service.js
const axios = require("axios");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const YouTubeService = {
    // Busqueda de videos por palabras claves
    async buscarVideos(query, maxResults = 20) {
        try {
            // Buscar videos por palabras clave
            const searchResponse = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: "snippet",
                    q: query,
                    maxResults,
                    key: YOUTUBE_API_KEY,
                    type: "video",
                },
            });

            // Extraer IDs de los videos
            const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(",");

            // Obtener estadísticas y duración
            const videosResponse = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videoIds,
                    key: YOUTUBE_API_KEY,
                },
            });

            // Obtener detalles completos (incluyendo imagen del canal)
            const videos = await Promise.all(
                videosResponse.data.items.map(async (video) => {
                    const channelId = video.snippet.channelId;

                    // Obtener imagen del canal
                    const canalResponse = await axios.get(`${BASE_URL}/channels`, {
                        params: {
                            part: "snippet",
                            id: channelId,
                            key: YOUTUBE_API_KEY,
                        },
                    });

                    const canal = canalResponse.data.items[0];
                    const imagenCanal = canal?.snippet?.thumbnails?.default?.url || null;
                    const publicado = video.snippet.publishedAt?.split("T")[0] || "";

                    // Retornar con formato unificado
                    return {
                        id: video.id,
                        titulo: video.snippet.title,
                        descripcion: video.snippet.description,
                        canal: video.snippet.channelTitle,
                        miniatura: video.snippet.thumbnails.high.url,
                        vistas: video.statistics.viewCount,
                        likes: video.statistics.likeCount,
                        duracion: video.contentDetails.duration,
                        canalImagen: imagenCanal,
                        publicado,
                    };
                })
            );

            return videos;
        } catch (error) {
            throw new Error("No se pudieron obtener videos de YouTube");
        }
    },

    // Obtencion de info de video por ID
    async obtenerVideoPorId(videoId) {
        try {
            // Obtener la información básica del video
            const response = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videoId,
                    key: YOUTUBE_API_KEY,
                },
            });

            const video = response.data.items[0];
            if (!video) throw new Error("Video no encontrado");

            // btener el ID del canal
            const channelId = video.snippet.channelId;

            // Consultar la imagen del canal
            const canalResponse = await axios.get(`${BASE_URL}/channels`, {
                params: {
                    part: "snippet",
                    id: channelId,
                    key: YOUTUBE_API_KEY,
                },
            });

            const canal = canalResponse.data.items[0];
            const imagenCanal = canal?.snippet?.thumbnails?.default?.url || null;
            const publicado = video.snippet.publishedAt?.split("T")[0] || "";

            // Devolver los datos completos
            return {
                id: video.id,
                titulo: video.snippet.title,
                descripcion: video.snippet.description,
                canal: video.snippet.channelTitle,
                miniatura: video.snippet.thumbnails.high.url,
                vistas: video.statistics.viewCount,
                likes: video.statistics.likeCount,
                duracion: video.contentDetails.duration,
                canalImagen: imagenCanal,
                publicado
            };
        } catch (error) {
            throw new Error("No se pudo obtener el video de YouTube");
        }
    },

    // Obtener videos populares por coordenadas
    async buscarVideosPorUbicacion(query = "", lat, lon, radio = "10km", maxResults = 20) {
        try {
            if (!lat || !lon) {
                throw new Error("Debes proporcionar coordenadas válidas (lat y lon)");
            }

            // Buscar videos cercanos
            const searchResponse = await axios.get(`${BASE_URL}/search`, {
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

            if (!searchResponse.data?.items?.length) {
                console.warn("Sin resultados para la ubicación");
                return [];
            }

            // Extraer IDs de los videos
            const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(",");

            // Obtener estadísticas (vistas, likes, duración)
            const videosResponse = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videoIds,
                    key: YOUTUBE_API_KEY,
                },
            });

            // Mapear datos + obtener imagen del canal
            const videos = await Promise.all(
                videosResponse.data.items.map(async (video) => {
                    const channelId = video.snippet.channelId;

                    // Consultar imagen del canal
                    const canalResponse = await axios.get(`${BASE_URL}/channels`, {
                        params: {
                            part: "snippet",
                            id: channelId,
                            key: YOUTUBE_API_KEY,
                        },
                    });

                    const canal = canalResponse.data.items[0];
                    const canalImagen = canal?.snippet?.thumbnails?.default?.url || null;
                    const publicado = video.snippet.publishedAt?.split("T")[0] || "";

                    // Estructura unificada
                    return {
                        id: video.id,
                        titulo: video.snippet.title,
                        descripcion: video.snippet.description,
                        canal: video.snippet.channelTitle,
                        miniatura: video.snippet.thumbnails.high?.url,
                        vistas: video.statistics.viewCount,
                        likes: video.statistics.likeCount,
                        duracion: video.contentDetails.duration,
                        canalImagen,
                        ubicacion: { lat, lon, radio },
                        publicado
                    };
                })
            );

            return videos;
        } catch (error) {
            throw new Error("No se pudieron obtener videos cercanos");
        }
    },

    // Obtener videos más populares cerca de coordenadas
    async buscarVideosPopulares(lat, lon, radio = "10km", maxResults = 20) {
        try {
            if (!lat || !lon) {
                throw new Error("Debes proporcionar coordenadas válidas (lat y lon)");
            }

            // Buscar videos más vistos en la zona
            const searchResponse = await axios.get(`${BASE_URL}/search`, {
                params: {
                    part: "snippet",
                    type: "video",
                    location: `${lat},${lon}`,
                    locationRadius: radio,
                    order: "viewCount", // ordenar por vistas
                    maxResults,
                    key: YOUTUBE_API_KEY,
                },
            });

            if (!searchResponse.data?.items?.length) {
                console.warn("No se encontraron videos populares para la ubicación");
                return [];
            }

            // Obtener IDs de los videos encontrados
            const videoIds = searchResponse.data.items.map((item) => item.id.videoId).join(",");

            // Obtener estadísticas (likes, vistas, duración)
            const videosResponse = await axios.get(`${BASE_URL}/videos`, {
                params: {
                    part: "snippet,statistics,contentDetails",
                    id: videoIds,
                    key: YOUTUBE_API_KEY,
                },
            });

            // Combinar información del video y del canal
            const videos = await Promise.all(
                videosResponse.data.items.map(async (video) => {
                    const channelId = video.snippet.channelId;

                    // Obtener imagen del canal
                    const canalResponse = await axios.get(`${BASE_URL}/channels`, {
                        params: {
                            part: "snippet",
                            id: channelId,
                            key: YOUTUBE_API_KEY,
                        },
                    });

                    const canal = canalResponse.data.items[0];
                    const canalImagen = canal?.snippet?.thumbnails?.default?.url || null;
                    const publicado = video.snippet.publishedAt?.split("T")[0] || "";

                    // Retornar en formato uniforme
                    return {
                        id: video.id,
                        titulo: video.snippet.title,
                        descripcion: video.snippet.description,
                        canal: video.snippet.channelTitle,
                        miniatura: video.snippet.thumbnails.high?.url,
                        vistas: video.statistics.viewCount,
                        likes: video.statistics.likeCount,
                        duracion: video.contentDetails.duration,
                        canalImagen,
                        ubicacion: { lat, lon, radio },
                        publicado
                    };
                })
            );

            return videos;
        } catch (error) {
            throw new Error("No se pudieron obtener videos populares");
        }
    },

};

module.exports = YouTubeService;
