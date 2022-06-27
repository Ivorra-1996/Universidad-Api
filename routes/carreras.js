var express = require("express");
var router = express.Router();
var models = require("../models");

//Funciona 
router.get("/", (req, res,next) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;

  models.carrera.findAll({attributes: ["id","nombre","id_instituto"],
      /////////se agrega la asociacion 
      include:[{as:'Instituto-Relacionado', model:models.instituto, attributes: ["id","nombre","director"]}],
      ////////////////////////////////
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer

    }).then(carreras => res.send(carreras)).catch(error => { return next(error)});
});

//Funciona 
router.post("/", (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre, id_instituto: req.body.id_instituto })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      include:[{as:'Instituto-Relacionado', model:models.instituto, attributes: ["id","nombre","director"]}],
      where: { id }
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

// Funciona 
router.get("/:id", (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

//funciona 
router.put("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre, id_instituto: req.body.id_instituto }, { fields: ["nombre","id_instituto"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          res.sendStatus(500).send(`Error al intentar actualizar la base de datos: ${error}`)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

// Funciona 
router.delete("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
