var express = require("express");
var router = express.Router();

var models = require("../models");

var validador = require('../routes/validador');
const alumnosControllers = require('../controllers/alumno_controller.js');


const findalumnos = (id, { onSuccess, onNotFound, onError }) => {
  models.alumnos
    .findOne({
      attributes: ["id","nombre","apellido","mail","dni","id_materia"],
      where: { id }
  })
  .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
  .catch(() => onError());
};



router
      .get("/:paginaActual&:cantidad", validador.validarToken, alumnosControllers.getAllAlumnos)
      .post("/", validador.validarToken, alumnosControllers.createdAlumno)
      .get("/:id", validador.validarToken, alumnosControllers.getOneAlumno)
      .put("/:id", validador.validarToken, alumnosControllers.updateAlumno)
      .delete("/:id", validador.validarToken, alumnosControllers.deleteAlumno);

module.exports = router;