'use strict';
module.exports = (sequelize, DataTypes) => {
  const profesor = sequelize.define('profesor', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  profesor.associate = function(models) {
    ///////////
  };
  return profesor;
};