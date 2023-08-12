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
    ////
  };
  return alumnos;
};