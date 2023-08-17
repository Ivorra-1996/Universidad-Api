const express = require('express');
const router = express.Router();
const logginsControllers = require('../controllers/loggin_controller.js');

//Rutas loggin y registro
router
    .get("/:paginaActual&:cantidad", logginsControllers.getAllLoggins)
    .post('/signin', logginsControllers.loggin)
    .post('/singup', logginsControllers.singupLoggin)

module.exports = router;
