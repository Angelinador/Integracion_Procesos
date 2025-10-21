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
        }
    },
    {
        sequelize,
        timestamps: false,
        modelName: "VideoReferencia",
        tableName: "videoReferencia",
    }
);

module.exports = VideoReferencia;

