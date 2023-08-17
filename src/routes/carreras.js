const express = require("express");
const router = express.Router();
const validador = require('../routes/validador');
const carreraControllers = require('../controllers/carrera_controller.js');

router
      .get("/:paginaActual&:cantidad", validador.validarToken, carreraControllers.getAllCarreras)
      .get("/:id", validador.validarToken, carreraControllers.getOneCarrera)
      .post("/", validador.validarToken, carreraControllers.createdCarrera)
      .put("/:id", validador.validarToken, carreraControllers.updateCarrera)
      .delete("/:id", validador.validarToken, carreraControllers.deleteCarrera)

module.exports = router;
