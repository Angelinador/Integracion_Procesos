const Historial = require("../models/record.model");
const Usuario = require("../models/user.model");
const { obtenerReferenciasPorHistorial } = require("../services/record.service");

const crearHistorial = async (req, res) => {
    try {
        const { idUsuario, latitud, longitud } = req.body;

        // Validar campos requeridos
        if (!idUsuario || latitud === undefined || longitud === undefined) {
            return res.status(400).json({
                success: false,
                message: "Faltan campos requeridos",
            });
        }

        // Verificar que el usuario exista
        const usuario = await Usuario.findByPk(idUsuario);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "El usuario no existe",
            });
        }

        // Desde el controlador se crea la llave primaria compuesta
        const idHistorial = `${idUsuario}_${latitud}_${longitud}`;
        // Verificamos el registro y si ya existe lo dejamos ser
        const existente = await Historial.findByPk(idHistorial);
        if (existente) {
            return res.status(200).json({
                success: true,
                message: "El historial ya existía previamente.",
                data: existente,
            });
        }
        const historial = await Historial.create({
            idHistorial,
            idUsuario,
            latitud,
            longitud,
        });
        res.status(201).json({
            success: true,
            message: "Registro de historial creado",
            data: historial,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "No se pudo crear el historial",
            error: error.message,
        });
    }
};

const obtenerHistoriales = async (req, res) => {
    try {
        const historiales = await Historial.findAll();

        if (!historiales.length) {
            return res.status(404).json({ mensaje: "No se encontraron historiales." });
        }

        res.json(historiales);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor." });
    }
};

const obtenerHistorial = async (req, res) => {
    try {
        const { idHistorial } = req.params;
        const historial = await Historial.findByPk(idHistorial);
        if (!historial) {
            return res.status(404).json({ mensaje: "Historial no encontrado." });
        }
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: "Error del servidor." });
    }
};

const referenciasPorHistorial = async (req, res) => {
    try {
        const { idHistorial } = req.params;
        if (!idHistorial) {
            return res.status(400).json({
                success: false,
                message: `Debe proporcionar un idHistorial en la solicitud no ${idHistorial}.`,
            });
        }
        const historial = await Historial.findByPk(idHistorial);
        if (!historial) {
            return res.status(404).json({
                success: false,
                message: `Historial con id '${idHistorial}' no encontrado.`,
            });
        }
        const referencias = await obtenerReferenciasPorHistorial(idHistorial) || [];
        if (referencias.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No hay referencias para este historial.",
            });
        }
        res.status(200).json({
            success: true,
            message: "Referencias obtenidas correctamente.",
            data: referencias,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error interno del servidor.",
            error: error.message,
        });
    }
};

module.exports = {
    crearHistorial,
    obtenerHistorial,
    obtenerHistoriales,
    referenciasPorHistorial
};
