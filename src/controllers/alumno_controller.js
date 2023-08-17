var models = require("../models");

const getAllAlumnos = async (req, res) => {
    try {  
      models.alumnos.findAll({
        offset: (parseInt(req.params.paginaActual) * parseInt(req.params.cantidad)),
        limit: parseInt(req.params.cantidad),
        
        attributes: ["id","nombre","apellido","mail","dni","id_materia"],
          /////////se agrega la asociacion 
    
        ////////////////// 
         // Envías la respuesta al cliente
      }).then(alumnos => res.status(200).json({ message: 'Alumnos obtenidos correctamente', data: alumnos }))

    } catch (error) 
    {
      // Manejo de errores en la validación del token
      res.status(401).json({ message: 'Token no válido', error: error.message });
    }
};

const findalumnos = (id, { onSuccess, onNotFound, onError }) => {
    models.alumnos
      .findOne({
        attributes: ["id","nombre","apellido","mail","dni","id_materia"],
        where: { id }
    })
    .then(alumnos => (alumnos ? onSuccess(alumnos) : onNotFound()))
    .catch(() => onError());
  };

const getOneAlumno = async (req,res) => {
    findalumnos(req.params.id, 
        {
            onSuccess: alumnos => res.send(alumnos),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
        });   
};

const createdAlumno = async (req,res) => {
    models.alumnos
        .create({ 
            nombre: req.body.nombre, apellido: req.body.apellido, mail: req.body.mail,
            dni: req.body.dni,id_materia: req.body.id_materia 
            })
        .then(alumnos => res.status(201).send
            ({ 
                id: alumnos.id , 
                nombre:alumnos.nombre, 
                apellido:alumnos.apellido,
                mail:alumnos.mail,
                dni:alumnos.dni,
                id_materia: alumnos.id_materia,
            })
        )
          .catch(error => 
            {
                if (error == "SequelizeUniqueConstraintError: Validation error") {
                    res.status(400).send('Bad request: existe otro usuario con los mismos datos')
                }
                else {
                    console.log(`Error al intentar insertar en la base de datos: ${error}`)
                    res.sendStatus(500)
                }
            });
};

const updateAlumno = async (req,res) =>{
    const onSuccess = alumnos =>
            alumnos
                .update({ 
                        nombre: req.body.nombre,
                        apellido: req.body.apellido,
                        mail: req.body.mail,
                        dni: req.body.dni,
                        id_materia: req.body.id_materia 
                        },
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
                findalumnos(req.params.id, 
                    {
                        onSuccess,
                        onNotFound: () => res.sendStatus(404),
                        onError: () => res.sendStatus(500)
                    }
                );
};

const deleteAlumno = async (req,res) => {
    const onSuccess = alumnos =>
            alumnos
                .destroy()
                .then(() => res.sendStatus(200))
                .catch(() => res.sendStatus(500));
            findalumnos(req.params.id, 
                {
                    onSuccess,
                    onNotFound: () => res.sendStatus(404),
                    onError: () => res.sendStatus(500)
                }
            );
};

module.exports = {
    getAllAlumnos,
    createdAlumno,
    getOneAlumno,
    updateAlumno,
    deleteAlumno
};





