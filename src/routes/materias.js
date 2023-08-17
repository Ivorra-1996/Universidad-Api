const express = require("express");
const router = express.Router();
const validador = require('../routes/validador');
const materiaController = require('../controllers/materia_controller.js');

router
      .get("/:paginaActual&:cantidad", validador.validarToken, materiaController.getAllMaterias)
      .get("/:id", validador.validarToken, materiaController.getOneMateria)
      .post("/", validador.validarToken, materiaController.createdMateria)
      .put("/:id", validador.validarToken, materiaController.updateMateria)
      .delete("/:id", validador.validarToken, materiaController.deleteMateria)

module.exports = router;
