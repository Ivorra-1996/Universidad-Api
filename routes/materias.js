var express = require("express");
var router = express.Router();
var models = require("../models");


// Nos trae todos los objetos que esten en la base de datos con sus atributos y objetos asociados con sus atributos.
router.get("/", (req, res,next) => {
  let paginaActual; 
  let cantidadAVer; 

  parseInt(req.query.paginaActual) ? paginaActual = parseInt(req.query.paginaActual) : paginaActual = 0;
  parseInt(req.query.cantidadAVer) ? cantidadAVer = parseInt(req.query.cantidadAVer) : cantidadAVer = 9999;

  models.materia.findAll({
    attributes: ["id","nombre","comision","diaDeCursada","id_carrera"],
      include:[
        {as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]},
        {as:'Profesor/es - Relacionado/s', model:models.profesor, attributes: ["id","nombre","apellido","email","id_materia"]},
        {as:'Alumnos - Relacionados', model:models.alumnos, attributes: ["id","nombre","apellido","mail","dni","id_materia"]}
      ],
      offset: (paginaActual*cantidadAVer),
      limit: cantidadAVer
    }).then(materias => res.send(materias)).catch(error => { return next(error)});
});

// Si que se repita su comision, tira error.
// habria que ver el tema del error o si se puede atender errores nuevos. Porque uno sirve para la comision ya que es unica.
router.post("/", (req, res) => {
  models.materia
    .create({nombre: req.body.nombre,comision: req.body.comision,diaDeCursada: req.body.diaDeCursada,id_carrera:req.body.id_carrera })
    .then(materia => res.status(201).send(`OK -> ${materia.nombre} Comision: ${materia.comision}`))
    .catch(error => {

      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con la misma comision')
      }
      else {
        res.sendStatus(500).send(`Error al intentar insertar en la base de datos: ${error}`)
      }

    });
});

// Encuenta la materia, con su objeto asociado y los atributos...
const findmateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre","comision","diaDeCursada","id_carrera"],
      /////////se agrega la asociacion 
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}]
      ////////////////////////////////
      ,where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findmateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

// Modifica los atributos de los objetos
router.put("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre,comision: req.body.comision,diaDeCursada: req.body.diaDeCursada,id_carrera: req.body.id_carrera }, 
        { fields: ["nombre","comision","diaDeCursada","id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findmateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

// Borra un objeto con solo su id.
router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findmateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
