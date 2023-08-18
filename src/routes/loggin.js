const express = require('express');
const router = express.Router();
const logginsControllers = require('../controllers/loggin_controller.js');

router
    .get("/:paginaActual&:cantidad", logginsControllers.getAllLoggins)
    .get('/:id', logginsControllers.getOneLoggin)
    .post('/signin', logginsControllers.loggin)
    .post('/singup', logginsControllers.singupLoggin)
    .put('/:id', logginsControllers.updatePassword)
    .delete('/:id', logginsControllers.deleteLoggin)

module.exports = router;