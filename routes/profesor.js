var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;
  console.log("Profesor corriendo");

  models.profesor
    .findAll({
      attributes: ["id", "apellido", "nombre","email", "id_materia"],
      include:[{as:'Materia - Relacionada', model:models.materia, attributes: ["id","nombre", "id_carrera"]}],
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer
    })
    .then(profesor => res.send(profesor))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
    models.profesor
      .create({nombre: req.body.nombre,apellido: req.body.apellido,email: req.body.email,id_materia: req.body.id_materia})
      .then(profesor => res.status(201).send({ id: profesor.id }))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro profesor con el mismo email')
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

router.get("/:id", (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: profesor => res.send(profesor),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

//funciona 
router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

