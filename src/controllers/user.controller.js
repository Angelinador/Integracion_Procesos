const { where } = require("sequelize");
const Usuario = require("../models/user.model");
const bcrypt = require("bcryptjs");

const crearUsuario = async (req, res) => {
    try {
        const { nombres, correoElectronico, contraseña } = req.body;

        // campos requeridos
        if (!nombres || !correoElectronico || !contraseña) {
            return res
                .status(400)
                .json({ success: false, message: "Faltan campos requeridos" });
        }

        // formato correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoElectronico)) {
            return res
                .status(400)
                .json({ success: false, message: "Formato de correo inválido" });
        }

        // existencia de correo
        const existe = await Usuario.findOne({ where: { correoElectronico } });
        if (existe) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un usuario con ese correo",
            });
        }

        // contraseña fuerte
        const regex = /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!regex.test(contraseña)) {
            return res.status(400).json({
                success: false,
                message:
                    "La contraseña debe tener al menos 8 caracteres y un carácter especial.",
            });
        }

        // 5) Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);
        req.body.contraseña = hashedPassword;
        const usuario = await Usuario.create(req.body);

        // Evitar enviar la contraseña, ni siquiera encriptada, en la respuesta
        usuario.contraseña = undefined;
        res.status(200).json({
            success: true,
            message: "Usuario creado",
            data: usuario,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error, no se pudo crear el usuario",
        });
    }
};


const encontrarUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        if (!usuarios) {
            return res
                .status(404)
                .json({ success: false, message: "Usuarios no encontrados" });
        }
        res.status(200).json({ success: true, data: usuarios });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error, no se pudo encontrar los usuarios",
        });
    }
};

const encontrarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
        }
        res.status(200).json({ success: true, data: usuario });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error, no se pido encontrar el usuario",
        });
    }
};

const encontrarIdUsuario = async (req, res) => {
    try {
        const { correoElectronico } = req.params;

        const usuario = await Usuario.findOne({
            where: { correoElectronico: correoElectronico },
        });

        if (!usuario) {
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
        }

        res.status(200).json({ success: true, data: usuario.idUsuario });
    } catch (error) {
        console.error("Error al buscar usuario:", error);
        res.status(400).json({
            success: false,
            message: "Error, no se pudo encontrar el usuario",
        });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        let { contraseña, nombres, apellidos, telefono, correoElectronico } = req.body;

        // Verificar que el usuario exista
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        const updates = {};

        // Validar correo electrónico
        if (correoElectronico !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correoElectronico)) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de correo inválido",
                });
            }

            // Verificar duplicado si cambió el correo
            if (correoElectronico !== usuario.correoElectronico) {
                const existe = await Usuario.findOne({
                    where: { correoElectronico },
                });
                if (existe) {
                    return res.status(409).json({
                        success: false,
                        message: "Ya existe un usuario con ese correo",
                    });
                }
            }
            updates.correoElectronico = correoElectronico;
        }

        // Validar nombres
        if (nombres !== undefined) {
            if (typeof nombres !== "string" || nombres.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "El campo 'nombres' no puede estar vacío",
                });
            }
            updates.nombres = nombres.trim();
        }

        // Validar apellidos (opcional)
        if (apellidos !== undefined) {
            if (typeof apellidos !== "string" || apellidos.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "El campo 'apellidos' no puede estar vacío",
                });
            }
            updates.apellidos = apellidos.trim();
        }

        // Validar teléfono (opcional)
        if (telefono !== undefined) {
            const phoneRegex = /^[0-9+\-()\s]{7,20}$/;
            if (!phoneRegex.test(telefono)) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de teléfono inválido",
                });
            }
            updates.telefono = telefono.trim();
        }

        // Validar y encriptar contraseña
        if (contraseña !== undefined) {
            const regex = /^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            if (!regex.test(contraseña)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "La contraseña debe tener al menos 8 caracteres y un carácter especial.",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(contraseña, salt);
            updates.contraseña = hashed;
        }

        // Aplicar cambios
        await usuario.update(updates);

        // Evitar enviar la contraseña, en encriptada, en la respuesta
        usuario.contraseña = undefined;

        res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            data: usuario,
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al actualizar usuario",
            error: error.message,
        });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res
                .status(404)
                .json({ success: false, message: "Usuario no encontrado" });
        }
        await usuario.destroy();
        res.status(200).json({ success: false, message: "Usuario eliminado" });
    } catch (error) {
        res
            .status(400)
            .json({
                success: false,
                message: "Error, no se pudo eliminar el usuario",
            });
    }
};


module.exports = {
    crearUsuario,
    encontrarUsuarios,
    encontrarUsuario,
    encontrarIdUsuario,
    actualizarUsuario,
    eliminarUsuario
};
