var express = require("express");
var router = express.Router();
var models = require("../models");

//Funca
router.get("/:paginaActual&:cantidad", (req, res) => {
    models.instituto
      .findAll({
        offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
        limit: parseInt(req.params.cantidad),
        attributes: ["id", "nombre","director"]
      })
      .then(instituto => res.send(instituto))
      .catch(() => res.sendStatus(500));
  });
  

//Funciona 
router.post("/", (req, res) => {
    models.instituto
      .create({ nombre: req.body.nombre, director: req.body.director }) //Agregar atributos
      .then(instituto => res.status(201).send({ id: instituto.id }))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro instituto con el mismo nombre')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  });
  
  const findInstituto = (id, { onSuccess, onNotFound, onError }) => {
    models.instituto
      .findOne({
        attributes: ["id", "nombre","director"],
        where: { id }
      })
      .then(instituto => (instituto ? onSuccess(instituto) : onNotFound()))
      .catch(() => onError());
  };

  // Funca
  router.get("/:id", (req, res) => {
    findInstituto(req.params.id, {
      onSuccess: instituto => res.send(instituto),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  //Funca
  router.put("/:id", (req, res) => {
    const onSuccess = instituto =>
    instituto
        .update({ nombre: req.body.nombre, director: req.body.director }, { fields: ["nombre","director"] })
        .then(() => res.sendStatus(200))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otra instituto con el mismo nombre')
          }
          else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
      findInstituto(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  //Funca
  router.delete("/:id", (req, res) => {
    const onSuccess = instituto =>
    instituto
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findInstituto(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  module.exports = router;
  