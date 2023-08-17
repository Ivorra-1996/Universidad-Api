var express = require("express");
var router = express.Router();
var validador = require('../routes/validador');
const alumnosControllers = require('../controllers/alumno_controller.js');

router
      .get("/:paginaActual&:cantidad", validador.validarToken, alumnosControllers.getAllAlumnos)
      .post("/", validador.validarToken, alumnosControllers.createdAlumno)
      .get("/:id", validador.validarToken, alumnosControllers.getOneAlumno)
      .put("/:id", validador.validarToken, alumnosControllers.updateAlumno)
      .delete("/:id", validador.validarToken, alumnosControllers.deleteAlumno);

module.exports = router;