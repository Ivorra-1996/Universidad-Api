var models = require('../models');
const express = require('express');
const router = express.Router();
//const {loggin} = require('../models/index'); // importa todos los modelos de DB que se encuentran dentro del archivo DB
const bcrypt = require('bcrypt'); // importamos para poder encriptar.
const jwt = require('jsonwebtoken'); // importamos el json web token para ponerle un codigo a la api.
require('dotenv').config('./.env');
const secret = process.env.SECRET;


//Rutas loggin y registro
router.post('/signin', (req,res) => {

    models.loggin
      .findOne({
        attributes: ["id","usuario","password"],
        where: { usuario: req.body.usuario }
    })
    .then(loggin => {

        // Si encuentra el usuario va a comparar la contraseña que tiene con la que le estan pasando por parametro.
        const esValido = bcrypt.compareSync(req.body.password,loggin.password) && (req.body.usuario == loggin.usuario);

        //Verifica si existe el usuario o no.
        if (esValido) {
            // Creamos el token
            let token = jwt.sign({loggin: loggin},secret,{expiresIn: "120s"});
            res.json({
                usuario: loggin,
                token: token
            })
        } 
        else {
            // Unauthorized Access
            res.status(401).send("Contraseña o usuario incorrecto")
        }
    }).catch(error => {
        res.status(404).send(`No existe el usuario!!!!`);
    })
});


router.post('/singup', (req,res) => {

    // Encriptamo password antes de pasarla.
    let password = bcrypt.hashSync(req.body.password,10);

    //Crear Usuario
    models.loggin.create({
        usuario: req.body.usuario,
        password: password
    }).then(loggin => { 
        // Generamos el token!!.
        let token = jwt.sign({usuario: loggin},secret,{expiresIn: "120s"});
        
        // Lo devolvemos como un objeto.
        res.json({
            usuario: loggin,
            token:token
        });
    }).catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Nombre de usuario en uso')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
});

router.get("/:paginaActual&:cantidad", (req, res) => {
    models.loggin
      .findAll({
        offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
        limit: parseInt(req.params.cantidad),
        attributes: ["id", "usuario"]
      })
      .then(loggin => res.send(loggin))
      .catch(() => res.sendStatus(500));
  });

module.exports = router;
