'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumnos = sequelize.define('alumnos', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    mail: DataTypes.STRING,
    dni: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  alumnos.associate = function(models) {
    // associations can be defined here
    alumnos.belongsTo(models.materia,  // Modelo al que pertenece
    {
      as: 'Materia - Relacionada',    // nombre de mi relacion
      foreignKey: 'id_materia'       // campo con el que voy a igualar 
    },
    alumnos.hasMany(models.profesor,  // Modelo al que pertenece
    {
      as: 'Profesor/es - Relacionado/s', // nombre de mi relacion
      foreignKey: 'id_materia', // Clave foranea en tabla externa 'profesor'
      sourceKey: 'id_materia' // Clave primaria referenciada para la asociacion    
    })
    )
  };
  return alumnos;
};