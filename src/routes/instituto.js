const express = require("express");
const router = express.Router();
const validador = require('../routes/validador');
const institutosControllers = require('../controllers/instituo_controller.js');

router
      .get("/:paginaActual&:cantidad", validador.validarToken, institutosControllers.getAllInstitutos)
      .get("/:id", validador.validarToken, institutosControllers.getOneInstitutos)
      .post("/", validador.validarToken, institutosControllers.createdInstituto)
      .put("/:id", validador.validarToken, institutosControllers.updateInstituto)
      .delete("/:id", validador.validarToken, institutosControllers.deleteInstituto)
  
module.exports = router;
