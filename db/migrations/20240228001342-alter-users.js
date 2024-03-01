'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'ballance');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'ballance', {
      type: Sequelize.DataTypes.DataType,
      allowNull: true // ou false, dependendo da sua necessidade
      // outros detalhes da coluna, como defaultValue, etc.
    });
  }
};
