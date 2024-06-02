const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Bill = sequelize.define('Bill', {
  Bill_ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Date_Issued: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Payment_Status: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  Patient_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'Patient_ID',
    },
  },
}, {
  tableName: 'Bill',
  timestamps: false,
});

Bill.belongsTo(Patient, { foreignKey: 'Patient_ID' });

module.exports = Bill;
