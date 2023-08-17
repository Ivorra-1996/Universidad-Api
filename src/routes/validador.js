require('dotenv').config();

var jwt = require('jsonwebtoken');

const secret = "BD";

function validarToken(req, res, next) {
  const accessToken = req.headers.authorization.split(" ")[1];
  if (!accessToken) res.send('Acceso denegado');
  jwt.verify(accessToken, secret, (err, user) => {
    if (err) {
      res.send('Acceso denegado o token expirado!!');
    } else {
      next();
    }
  });
}

module.exports.validarToken = validarToken;
