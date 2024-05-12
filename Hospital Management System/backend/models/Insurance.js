const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Insurance = sequelize.define('Insurance', {
  Policy_Number: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Patient_ID: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patient', // Refer to the patient table
      key: 'Patient_ID', // Refer to the correct field in the patient table
    },
  },
  Ins_Code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  End_Date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Plan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Co_Pay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Coverage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Maternity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Dental: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Optical: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'insurance', 
  timestamps: false,              
});
Insurance.belongsTo(Patient, {foreignKey: 'Patient_ID'});
module.exports = Insurance; 
