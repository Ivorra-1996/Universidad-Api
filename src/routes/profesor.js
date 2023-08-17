var express = require("express");
var router = express.Router();
var models = require("../models");
var validador = require('../routes/validador');

router.get("/:paginaActual&:cantidad",validador.validarToken, (req, res) => {
  models.profesor
    .findAll({
      offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
      limit: parseInt(req.params.cantidad),

      attributes: ["id","nombre","apellido","email", "id_materia"]
    })
    .then(profesor => res.send(profesor))
    .catch(() => res.status(500).send("Error en el servidor"));
});

router.post("/",validador.validarToken, (req, res) => {
    models.profesor
      .create({
        nombre: req.body.nombre, 
        apellido: req.body.apellido,
        email: req.body.email,
        id_materia: req.body.id_materia
      }).then(profesor => res.status(201).send({ 
        id: profesor.id,
        nombre: profesor.nombre,
        apellido: profesor.apellido,
        email: profesor.email,
        id_materia: profesor.id_materia,
      }))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(406).send('Ya existe una cuenta con esos datos')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  });

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesor
    .findOne({
      attributes: ["id", "nombre","apellido","email","id_materia"],
      /////////se agrega la asociacion 
 
      ////////////////////////////////
      where: { id }
    })
    .then(profesor => (profesor ? onSuccess(profesor) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id",validador.validarToken, (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: profesor => res.send(profesor),
    onNotFound: () => res.status(404).send("Usuario no encontrado"),
    onError: () => res.status(500).send("Error en el servidor"),
  });
});

//funciona 
router.put("/:id",validador.validarToken, (req, res) => {
  const onSuccess = profesor =>
      profesor
      .update({ nombre: req.body.nombre,apellido: req.body.apellido,email: req.body.email,id_materia: req.body.id_materia},
           { fields: ["nombre","apellido","email","id_materia"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro usuario con el mismo email!!!!')
        }
        else {
          res.sendStatus(500).send(`Error al intentar actualizar la base de datos: ${error}`)
        }
      });
      findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id",validador.validarToken, (req, res) => {
  const onSuccess = profesor =>
    profesor
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});


module.exports = router;

