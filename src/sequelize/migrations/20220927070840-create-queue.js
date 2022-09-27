'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Queues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ownerSnowflake: {
        allowNull: false,
        type: Sequelize.STRING
      },
      messageSnowflake: {
        allowNull: false,
        type: Sequelize.STRING
      },
      parameters: {
        allowNull: false,
        type: Sequelize.JSON
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('queued', 'processing', 'completed')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Queues');
  }
};