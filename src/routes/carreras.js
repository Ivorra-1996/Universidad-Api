var express = require("express");
var router = express.Router();
var models = require("../models");
var validador = require('../routes/validador');

const carreraControllers = require('../controllers/carrera_controller.js');

router.get("/:paginaActual&:cantidad",validador.validarToken, (req, res) => {
  models.carrera.findAll({
    offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
    limit: parseInt(req.params.cantidad),
    
    attributes: ["id","nombre","id_instituto"],
      /////////se agrega la asociacion 
      include:[{as:'Instituto-Relacionado', model:models.instituto, attributes: ["id","nombre","director"]}]
      ////////////////////////////////

    }).then(carreras => res.send(carreras));
});


router.post("/",validador.validarToken, (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre, id_instituto: req.body.id_instituto })
    .then(carrera => {
      const formattedCarrera = {
        id: carrera.id,
        nombre: carrera.nombre,
        id_instituto: carrera.id_instituto
      };

      const prettyFormattedCarrera = JSON.stringify(formattedCarrera, null, 2);

      res.status(201).send(prettyFormattedCarrera);
    })
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

 
router.get("/:id",validador.validarToken, (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

 
router.put("/:id",validador.validarToken, (req, res) => {
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


router.delete("/:id",validador.validarToken, (req, res) => {
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
