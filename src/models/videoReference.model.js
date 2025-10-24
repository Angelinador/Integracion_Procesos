const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../db");

class VideoReferencia extends Model { }

VideoReferencia.init(
    {
        idReferencia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idHistorial: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "historial",
                key: "idHistorial"
            }
        },
        idVideo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        descripcion: {
            type: DataTypes.STRING (270),
            allowNull: true,
        },
        canal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        miniatura: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        vistas: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        likes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        canalImagen: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publicado: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "VideoReferencia",
        tableName: "videoReferencia",
    }
);

module.exports = VideoReferencia;

