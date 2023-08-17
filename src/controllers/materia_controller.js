const models = require("../models");

const getAllMaterias = async (req, res) => {
    models.materia.findAll({
        offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
        limit: parseInt(req.params.cantidad),
      
        attributes: ["id","nombre","comision","diaDeCursada","id_carrera"],
            include:[
                {as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]},
                {as:'Profesor/es - Relacionado/s', model:models.profesor, attributes: ["id","nombre","apellido","email","id_materia"]},
                {as:'Alumnos - Relacionados', model:models.alumnos, attributes: ["id","nombre","apellido","mail","dni","id_materia"]}
            ]
        }).then(materias => res.send(materias)).catch(error => { return error});
};

const findmateria = (id, { onSuccess, onNotFound, onError }) => {
    models.materia
      .findOne(
            {
                attributes: ["id", "nombre","comision","diaDeCursada","id_carrera"],
                /////////se agrega la asociacion 
                include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]},
                {as:'Profesor/es - Relacionado/s', model:models.profesor, attributes: ["id","nombre","apellido","email","id_materia"]},
                {as:'Alumnos - Relacionados', model:models.alumnos, attributes: ["id","nombre","apellido","mail","dni","id_materia"]}]
                ////////////////////////////////
                ,where: { id }
            }
        )
      .then(materia => (materia ? onSuccess(materia) : onNotFound()))
      .catch(() => onError());
};

const getOneMateria = async (req, res) => {
    findmateria(req.params.id, {
      onSuccess: materia => res.send(materia),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};
  

const createdMateria = async (req, res) => {
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
};

const updateMateria = async (req, res) => {
    const onSuccess = materia =>
        materia
            .update({ nombre: req.body.nombre,comision: req.body.comision,diaDeCursada: req.body.diaDeCursada,id_carrera: req.body.id_carrera }, 
                { fields: ["nombre","comision","diaDeCursada","id_carrera"] })
            .then(() => res.sendStatus(200))
            .catch(error => 
                {
                    if (error == "SequelizeUniqueConstraintError: Validation error") {
                        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
                    }
                    else {
                        console.log(`Error al intentar actualizar la base de datos: ${error}`)
                        res.sendStatus(500)
                    }
                }
            );
      findmateria(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

const deleteMateria = async (req, res) => {
    const onSuccess = materia =>
        materia
            .destroy()
            .then(() => res.sendStatus(200))
            .catch(() => res.sendStatus(500));
    findmateria(req.params.id, 
        {
            onSuccess,
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
        }
    );
};

module.exports = {
    getAllMaterias,
    getOneMateria,
    createdMateria,
    updateMateria,
    deleteMateria
};