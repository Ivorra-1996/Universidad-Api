require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "BD"; // Usamos el valor de .env o un valor por defecto

function validarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Acceso denegado: Encabezado de autorización inválido');
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      throw new Error('Acceso denegado: Token de acceso no proporcionado');
    }

    jwt.verify(accessToken, secret, (err, user) => {
      if (err) {
        throw new Error('Acceso denegado o token expirado');
      } else {
        next();
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Error en la autorización', error: error.message });
  }
}

module.exports.validarToken = validarToken;