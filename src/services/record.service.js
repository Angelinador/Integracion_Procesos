// El controlador se encuentra ubicado en record.controller

const VideoReferencia = require("../models/videoReference.model");

const obtenerReferenciasPorHistorial = async (idHistorial) => {
  try {
    const referencias = await VideoReferencia.findAll({
      where: { idHistorial },
    });

    return referencias;
  } catch (error) {
    console.error("Error al obtener las referencias de video:", error);
    throw error;
  }
};

module.exports = {
  obtenerReferenciasPorHistorial,
};
