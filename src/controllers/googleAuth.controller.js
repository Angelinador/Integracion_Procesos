const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuthController = async (req, res) => {
    try {
        const { token } = req.body;

        // Verifica el token de Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        // Aquí podrías buscar/crear el usuario en tu DB
        // const usuario = await Usuario.findOrCreate({ where: { email }, defaults: { nombre: name } });

        // Generar tu propio JWT interno
        const jwtToken = jwt.sign(
            { email, name, sub },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ success: true, jwt: jwtToken });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: "Error al autenticar con Google" });
    }
};
