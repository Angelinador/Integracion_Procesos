const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../db");

class Imagen extends Model { }

Imagen.init(
    {
        idImagen: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombreArchivo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "usuario",
                key: "idUsuario",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        ruta: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Imagen",
        tableName: "imagen",
    }
);
module.exports = Imagen;
