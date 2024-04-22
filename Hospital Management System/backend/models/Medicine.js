// backend/models/Medicine.js
const { DataTypes } = require('sequelize'); // Import DataTypes for defining model fields
const sequelize = require('../config/database'); // Import the Sequelize instance

const Medicine = sequelize.define('Medicine', {
  Medicine_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  M_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  M_Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  M_Cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'medicine',
  timestamps: false,
});

module.exports = Medicine;
