const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../db");

class Usuario extends Model { }

Usuario.init(
    {
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        nombres: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apellidos: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        correoElectronico: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contraseña: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8],
                    msg: "La contraseña debe tener al menos 8 caracteres",
                },
                is: {
                    args: /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                    msg: "La contraseña debe incluir al menos un carácter especial",
                },
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Usuario",
        tableName: "usuario",
    }
);

module.exports = Usuario;
