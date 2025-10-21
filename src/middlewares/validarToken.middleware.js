const jwt = require("jsonwebtoken");
const TOKEN_SECRET = process.env.TOKEN_SECRET;

function validarToken(req, res, next) {
  try {
    let token = req.cookies?.token;

    // Si no hay cookie, intentar leerlo desde el header Authorization
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // Si no existe token en ningún lado
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado: no se proporcionó token",
      });
    }

    // Verificar token
    const verificado = jwt.verify(token, TOKEN_SECRET);

    // Guardar los datos decodificados (id, correo, etc.)
    req.user = verificado;

    next(); // continuar hacia el controlador
  } catch (error) {
    console.error("Error al validar token:", error);
    return res.status(403).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Token expirado. Vuelve a iniciar sesión."
          : "Token inválido o no autorizado.",
    });
  }
}

module.exports = { validarToken };
