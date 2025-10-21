const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../db");

class Historial extends Model { }

Historial.init(
    {
        idHistorial: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },

        // Estos tres atributos (idUsuario, altitud, latitud) son la base para el 
        // cambio de historial dinamico en base a las coordenadas del usuario
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "usuario",
                key: "idUsuario",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        altitud: {
            type: DataTypes.DECIMAL(10, 4), // [19.456700] los ultimos digitos seran para abarcar mas area
            allowNull: false,
        },
        latitud: {
            type: DataTypes.DECIMAL(10, 4), // [19.456700] los ultimos digitos seran para abarcar mas area
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Historial",
        tableName: "historial",
    }
);

module.exports = Historial;
