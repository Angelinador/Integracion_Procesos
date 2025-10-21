const Historial = require("./record.model");
const Usuario = require("./user.model");
const VideoReferencia = require("./videoReference.model");

module.exports = () => {
    // Usuario (1...1) [1:N] (1...N) Historial
    Historial.belongsTo(Usuario, {
        foreignKey: "idUsuario",
        as: "usuario"
    });

    Usuario.hasMany(Historial, {
        foreignKey: "idUsuario",
        as: "historiales"
    });

    // Historial (1:N) VideoReferencia 
    VideoReferencia.belongsTo(Historial, {
        foreignKey: "idHistorial",
        as: "historial",
    });
    
    Historial.hasMany(VideoReferencia, {
        foreignKey: "idHistorial",
        as: "referencias",
    });
};
