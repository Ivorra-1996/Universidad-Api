var jwt = require('jsonwebtoken')
require('dotenv').config('./.env');
const secret = process.env.SECRET;

function validarToken(req, res, next){
    
    const accessToken = req.headers.authorization.split(" ")[1];
    if(!accessToken) res.send('acceso denegado');

    jwt.verify(accessToken, secret, (err, user) =>{
      if(err){
        res.send('acceso denegado o token expirado!!');
      }else {
        next();
      }
    })
  }

  module.exports.validarToken = validarToken;
