const models = require("../models");

const getAllInstitutos = async (req, res) => {
    models.instituto
        .findAll(
            {
                offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
                limit: parseInt(req.params.cantidad),
                attributes: ["id", "nombre","director"]
            }
        )
      .then(instituto => res.send(instituto))
      .catch(() => res.sendStatus(500));
};

const findInstituto = (id, { onSuccess, onNotFound, onError }) => {
    models.instituto
      .findOne({
        attributes: ["id", "nombre","director"],
        where: { id }
      })
      .then(instituto => (instituto ? onSuccess(instituto) : onNotFound()))
      .catch(() => onError());
  };

const getOneInstitutos = async (req, res) => {
    findInstituto(req.params.id, 
        {
            onSuccess: instituto => res.send(instituto),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
        }
    );
};

const createdInstituto = async (req, res) => {
    models.instituto
      .create({ nombre: req.body.nombre, director: req.body.director }) //Agregar atributos
      .then(instituto => res.status(201).send({ id: instituto.id }))
      .catch(error => 
            {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otro instituto con los mismos datos')
                }
                else {
                    console.log(`Error al intentar insertar en la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            }     
        );
};

const updateInstituto = async (req, res) => {
    const onSuccess = instituto =>
        instituto
            .update({ nombre: req.body.nombre, director: req.body.director }, { fields: ["nombre","director"] })
            .then(() => res.sendStatus(200))
            .catch(error => 
                {
                  if (error == "SequelizeUniqueConstraintError: Validation error") {
                        res.status(400).send('Bad request: existe otro instituto los mismos datos')
                    }
                    else {
                        console.log(`Error al intentar actualizar la base de datos: ${error}`)
                        res.sendStatus(500)
                    }
                }
            );
      findInstituto(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

const deleteInstituto = async (req, res) => {
    const onSuccess = instituto =>
                instituto
                    .destroy()
                    .then(() => res.sendStatus(200))
                    .catch(() => res.sendStatus(500));
    findInstituto(req.params.id, 
        {
            onSuccess,
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
        }
    );
};

module.exports = {
    getAllInstitutos,
    getOneInstitutos,
    createdInstituto,
    updateInstituto,
    deleteInstituto
};