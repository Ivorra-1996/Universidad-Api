var express = require("express");
var router = express.Router();

var models = require("../models");

var validador = require('../routes/validador');
const alumnosControllers = require('../controllers/alumno_controller.js');

router.get("/:paginaActual&:cantidad", validador.validarToken, alumnosControllers.getAllAlumnos);





router.post("/",validador.validarToken, (req, res) => {
    models.alumnos
      .create({ nombre: req.body.nombre, apellido: req.body.apellido, mail: req.body.mail,
        dni: req.body.dni,id_materia: req.body.id_materia })
      .then(alumnos => res.status(201).send({ 
        id: alumnos.id , 
        nombre:alumnos.nombre, 
        apellido:alumnos.apellido,
        mail:alumnos.mail,
        dni:alumnos.dni,
        id_materia: alumnos.id_materia,
      }))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro usuario con el mismo mail o dni')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  });

const findalumnos = (id, { onSuccess, onNotFound, onError }) => {
    models.alumnos
      .findOne({
        attributes: ["id","nombre","apellido","mail","dni","id_materia"],
        where: { id }
    })
    .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
    .catch(() => onError());
};
  

router.get("/:id",validador.validarToken, (req, res) => {
    findalumnos(req.params.id, {
      onSuccess: alumnos => res.send(alumnos),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
});

//funciona 
router.put("/:id",validador.validarToken,(req, res) => {
    const onSuccess = alumnos =>
        alumnos
        .update({ nombre: req.body.nombre,apellido: req.body.apellido,mail: req.body.mail,dni: req.body.dni,
          id_materia: req.body.id_materia },
             { fields: ["nombre","apellido","mail","dni","id_materia"] })
        .then(() => res.sendStatus(200))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otro usuario con el mismo email o dni!!!!')
          }
          else {
            res.sendStatus(500).send(`Error al intentar actualizar la base de datos: ${error}`)
          }
        });
        findalumnos(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
});

router.delete("/:id",validador.validarToken, (req, res) => {
    const onSuccess = alumnos =>
      alumnos
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findalumnos(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });

module.exports = router;