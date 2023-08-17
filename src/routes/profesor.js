const express = require("express");
const router = express.Router();
const validador = require('../routes/validador');
const profesorController = require('../controllers/profesor_controller.js');

router
      .get("/:paginaActual&:cantidad", validador.validarToken, profesorController.getAllProfesores)
      .get("/:id", validador.validarToken, profesorController.getOneProfesor)
      .post("/", validador.validarToken, profesorController.createProfesor)
      .put("/:id", validador.validarToken, profesorController.updateProfesor)
      .delete("/:id", validador.validarToken, profesorController.deleteProfesor)
      
module.exports = router;

