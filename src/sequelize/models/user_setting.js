'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_Setting.init({
    uuid: DataTypes.STRING,
    settingUuid: DataTypes.STRING,
    userUuid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User_Setting',
  });
  return User_Setting;
};