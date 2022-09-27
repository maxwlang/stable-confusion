'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Queue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Queue.init({
    uuid: DataTypes.STRING,
    ownerSnowflake: DataTypes.STRING,
    messageSnowflake: DataTypes.STRING,
    parameters: DataTypes.JSON,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Queue',
  });
  return Queue;
};