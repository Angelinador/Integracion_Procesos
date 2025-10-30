const jwt = require("jsonwebtoken");
const Usuario = require("../models/user.model");
const bcrypt = require("bcryptjs");
const Imagen = require("../models/image.model");

const TOKEN_SECRET = process.env.TOKEN_SECRET || "clave_secreta_temporal";

// Inicio de sesion
const generar = async (req, res) => {
    try {
        const { correoElectronico, contraseña } = req.body;

        // Validar que vengan ambos campos
        if (!correoElectronico || !contraseña) {
            return res.status(400).json({
                success: false,
                mensaje: "Faltan campos requeridos",
            });
        }

        // Buscar usuario por correo
        const usuario = await Usuario.findOne({
            where: { correoElectronico },
            include: {
                model: Imagen,
                as: "perfil",
                attributes: ["nombreArchivo", "ruta"],
            },
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                mensaje: "Usuario no encontrado",
            });
        }

        // Comparar contraseñas
        const valida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!valida) {
            return res.status(401).json({
                success: false,
                mensaje: "Contraseña incorrecta",
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                idUsuario: usuario.idUsuario,
                correoElectronico: usuario.correoElectronico,
            },
            TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        // Guardar token en cookie segura
        res.cookie("token", token, {
            httpOnly: true, // No accesible desde JS
            secure: process.env.NODE_ENV === "production", // Solo HTTPS en prod
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 día
        });

        // Respuesta al cliente
        res.status(200).json({
            success: true,
            mensaje: "Autenticado correctamente",
            token,
            usuario: {
                idUsuario: usuario.idUsuario,
                nombres: usuario.nombres,
                correoElectronico: usuario.correoElectronico,
                imagen: usuario.perfil ? {
                    nombreArchivo: usuario.perfil.nombreArchivo,
                    ruta: usuario.perfil.ruta,
                } : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: "Error interno en el servidor",
            error: error.message,
        });
    }
};

// Cerrar sesion
const remover = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.status(200).json({
        success: true,
        mensaje: "Sesión cerrada correctamente",
    });
};

module.exports = { generar, remover };
