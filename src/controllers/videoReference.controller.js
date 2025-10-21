const VideoReferencia = require("../models/videoReference.model");
const Historial = require("../models/record.model");

const crearVideoReferencia = async (req, res) => {
    try {
        const { idHistorial, idVideo } = req.body;

        // Validar campos requeridos
        if (!idHistorial || !idVideo) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos requeridos (idHistorial, idVideo)",
            });
        }

        // Verificar existencia del historial
        const historial = await Historial.findByPk(idHistorial);
        if (!historial) {
            return res.status(404).json({
                success: false,
                message: "No existe el historial de referencia.",
            });
        }

        // Crear el registro
        const referencia = await VideoReferencia.create({
            idHistorial,
            idVideo,
        });

        res.status(201).json({
            success: true,
            message: "Video agregado correctamente al historial.",
            data: referencia,
        });
    } catch (error) {
        console.error("Error al crear la referencia de video:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al crear la referencia de video.",
            error: error.message,
        });
    }
};

const obtenerReferencia = async (req, res) => {
    try {
        const { idReferencia } = req.params;

        const referencia = await VideoReferencia.findByPk(idReferencia);

        if (!referencia) {
            return res.status(404).json({
                success: false,
                message: "No se encontró la referencia de video especificada.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Referencia obtenida correctamente.",
            data: referencia,
        });
    } catch (error) {
        console.error("Error al obtener la referencia de video:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al obtener la referencia de video.",
            error: error.message,
        });
    }
};

const obtenerReferencias = async (req, res) => {
    try {
        const referencias = await VideoReferencia.findAll();

        if (!referencias.length) {
            return res.status(404).json({
                success: false,
                message: "No hay registros de referencias de video en la base de datos.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Referencias de video obtenidas correctamente.",
            data: referencias,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error interno al obtener las referencias de video.",
            error: error.message,
        });
    }
};

module.exports = {
    crearVideoReferencia,
    obtenerReferencia,
    obtenerReferencias,
};
