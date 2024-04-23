const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Appointment', {
    Patient_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Patient_Fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Patient_Lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Blood_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Conditionn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Admission_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Discharge_Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'patient',
    timestamps: false,
  });
  
  module.exports = Patient;