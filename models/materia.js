'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    comision: DataTypes.INTEGER,
    diaDeCursada: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});

  materia.associate = function(models) {
  	
    //asociacion a carrera (pertenece a:)
  	materia.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera',     // campo con el que voy a igualar
      sourceKey: 'id'
    });
    materia.hasMany(models.profesor,{ // de uno a muchos -> dependiendo de la cantidad de profes.
      as : 'Profesor/es - Relacionado/s',
      foreignKey: 'id_materia', // Clave foranea en tabla externa 'profesor'
      sourceKey: 'id' // Clave primaria referenciada para la asociacion
    });

    // Tendria que hacer los alumnos 
    materia.hasMany(models.alumnos,{ // de uno a muchos -> dependiendo de la cantidad de profes.
      as : 'Alumnos - Relacionados',
      foreignKey: 'id_materia', // Clave foranea en tabla externa 'alumno'
      sourceKey: 'id' // Clave primaria referenciada para la asociacion
    });

  };
  return materia;
};