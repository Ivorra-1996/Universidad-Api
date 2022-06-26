'use strict';
module.exports = (sequelize, DataTypes) => {
  const loggin = sequelize.define('loggin', {
    usuario: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  loggin.associate = function(models) {
    // associations can be defined here
  };
  return loggin;
};

