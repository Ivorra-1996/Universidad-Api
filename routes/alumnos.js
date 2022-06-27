var express = require("express");
var router = express.Router();
var models = require("../models");

//-> Falta agregar asociasion, del docente y del alumnos que estan en la misma tabla, se diferencia con el rol.
router.get("/", (req, res,next) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;


  models.alumnos.findAll({attributes: ["id","nombre","apellido","mail","dni","id_materia"],
      /////////se agrega la asociacion 
    include:[{as:'Materia - Relacionada', model:models.materia, attributes: ["id","nombre","comision","diaDeCursada"]}
    ,
    {as:'Profesor/es - Relacionado/s', model:models.profesor, attributes: ["id","nombre","apellido","email","id_materia"]}],
    //////////////////  
    offset: (paginaActual*cantidadAVer),
    limit: cantidadAVer
  
  }).then(alumnos => res.send(alumnos)).catch(error => { return next(error)});
});


router.post("/", (req, res) => {
    models.alumnos
      .create({ nombre: req.body.nombre, apellido: req.body.apellido, mail: req.body.mail,
        dni: req.body.dni,id_materia: req.body.id_materia })
      .then(alumnos => res.status(201).send({ id: alumnos.id }))
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
        // Incluir o asoc. la materia.
        /// include:[{as:'Instituto-Relacionado', model:models.instituto, attributes: ["id","nombre","director"]}],
        where: { id }
    })
    .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
    .catch(() => onError());
};
  

router.get("/:id", (req, res) => {
    findalumnos(req.params.id, {
      onSuccess: alumnos => res.send(alumnos),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
});

//funciona 
router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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