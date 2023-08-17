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

    } catch (error) {
      // Manejo de errores en la validación del token
      res.status(401).json({ message: 'Token no válido', error: error.message });
    }
  };

module.exports = {getAllAlumnos};





